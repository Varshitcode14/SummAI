from flask import Blueprint, request, jsonify
from services.llm_service import summarize_text, summarize_pdf, extract_topics_and_roadmap

summarize_bp = Blueprint("summarize", __name__)


# ── Existing: summarize plain text ──────────────────────────────────────────
@summarize_bp.route("/summarize", methods=["POST"])
def summarize():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"success": False, "error": "Missing 'text' in request body"}), 400

    text = data.get("text", "").strip()
    summary_type = data.get("summary_type", "detailed")

    if not text:
        return jsonify({"success": False, "error": "Text cannot be empty"}), 400
    if len(text.split()) < 10:
        return jsonify({"success": False, "error": "Text is too short (min 10 words)"}), 400
    if summary_type not in ["brief", "detailed", "bullet"]:
        return jsonify({"success": False, "error": "summary_type must be: brief, detailed, or bullet"}), 400

    result = summarize_text(text, summary_type)
    return jsonify(result), 200 if result["success"] else 500


# ── New: summarize PDF ───────────────────────────────────────────────────────
@summarize_bp.route("/summarize-pdf", methods=["POST"])
def summarize_pdf_route():
    if "file" not in request.files:
        return jsonify({"success": False, "error": "No file uploaded. Use key 'file'"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"success": False, "error": "Empty filename"}), 400
    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"success": False, "error": "Only PDF files are supported"}), 400

    summary_type = request.form.get("summary_type", "detailed")
    if summary_type not in ["brief", "detailed", "bullet"]:
        return jsonify({"success": False, "error": "summary_type must be: brief, detailed, or bullet"}), 400

    file_bytes = file.read()
    result = summarize_pdf(file_bytes, summary_type)
    return jsonify(result), 200 if result["success"] else 500


from services.llm_service import summarize_text, summarize_pdf, extract_topics_and_roadmap, generate_flowchart

# ── New: topics + roadmap ─────────────────────────────────────────────────────
@summarize_bp.route("/roadmap", methods=["POST"])
def roadmap():
    # Accepts either JSON text or PDF file
    if request.content_type and "multipart/form-data" in request.content_type:
        # PDF upload
        if "file" not in request.files:
            return jsonify({"success": False, "error": "No file uploaded"}), 400
        file = request.files["file"]
        if not file.filename.lower().endswith(".pdf"):
            return jsonify({"success": False, "error": "Only PDF files supported"}), 400
        from services.llm_service import extract_text_from_pdf
        text = extract_text_from_pdf(file.read())
    else:
        # Plain text
        data = request.get_json()
        if not data or "text" not in data:
            return jsonify({"success": False, "error": "Missing 'text' in request body"}), 400
        text = data.get("text", "").strip()

    if not text or len(text.split()) < 10:
        return jsonify({"success": False, "error": "Text too short (min 10 words)"}), 400

    result = extract_topics_and_roadmap(text)
    return jsonify(result), 200 if result["success"] else 500


# ── New: flowchart with mini summaries ───────────────────────────────────────
@summarize_bp.route("/flowchart", methods=["POST"])
def flowchart():
    # Accepts either JSON text or PDF file
    if request.content_type and "multipart/form-data" in request.content_type:
        if "file" not in request.files:
            return jsonify({"success": False, "error": "No file uploaded"}), 400
        file = request.files["file"]
        if not file.filename.lower().endswith(".pdf"):
            return jsonify({"success": False, "error": "Only PDF files supported"}), 400
        from services.llm_service import extract_text_from_pdf
        text = extract_text_from_pdf(file.read())
    else:
        data = request.get_json()
        if not data or "text" not in data:
            return jsonify({"success": False, "error": "Missing 'text' in request body"}), 400
        text = data.get("text", "").strip()

    if not text or len(text.split()) < 10:
        return jsonify({"success": False, "error": "Text too short (min 10 words)"}), 400

    result = generate_flowchart(text)
    return jsonify(result), 200 if result["success"] else 500


# ── New: extract topics + roadmap ────────────────────────────────────────────
@summarize_bp.route("/topics", methods=["POST"])
def topics():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"success": False, "error": "Missing 'text' in request body"}), 400

    text = data.get("text", "").strip()
    if not text or len(text.split()) < 10:
        return jsonify({"success": False, "error": "Text is too short (min 10 words)"}), 400

    result = extract_topics_and_roadmap(text)
    return jsonify(result), 200 if result["success"] else 500


# ── Health check ─────────────────────────────────────────────────────────────
@summarize_bp.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Summarizer API is running"}), 200   