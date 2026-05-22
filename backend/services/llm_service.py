import os
import io
import json
import re
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from utils.prompt_template import get_summary_prompt, get_topics_prompt, get_flowchart_prompt
import PyPDF2

load_dotenv()

def get_llm():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY not found in environment variables")
    return ChatGroq(
        model="llama-3.1-8b-instant",
        temperature=0.3,
        groq_api_key=api_key,
        max_tokens=1024,        # cap output tokens — speeds up response
        request_timeout=30,     # don't hang forever
    )

def run_chain(prompt: PromptTemplate, inputs: dict) -> str:
    """Modern RunnableSequence replacing deprecated LLMChain."""
    llm = get_llm()
    chain = prompt | llm | StrOutputParser()
    return chain.invoke(inputs).strip()

def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"
    return text.strip()

def trim_to_words(text: str, max_words: int) -> str:
    words = text.split()
    return " ".join(words[:max_words]) if len(words) > max_words else text

def chunk_text(text: str, chunk_size: int = 1800, chunk_overlap: int = 100) -> list:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ".", " "]
    )
    return splitter.split_text(text)

# ── Summarize ────────────────────────────────────────────────────────────────

def summarize_text(text: str, summary_type: str = "detailed") -> dict:
    try:
        word_count = len(text.split())

        if word_count <= 1200:
            # Small enough — single call
            prompt = get_summary_prompt()
            summary = run_chain(prompt, {"text": text, "summary_type": summary_type})
        else:
            # Chunk → summarize each → merge
            chunks = chunk_text(text)
            chunk_summaries = []
            for chunk in chunks:
                s = run_chain(get_summary_prompt(), {"text": chunk, "summary_type": summary_type})
                chunk_summaries.append(s)

            # Merge
            combined = "\n\n".join(chunk_summaries)
            merge_template = f"""Combine these partial summaries into one coherent final summary.
Summary type: {summary_type} (brief=2-3 sentences, detailed=paragraph, bullet=bullet points)

Partial summaries:
{{combined}}

Final summary:"""
            merge_prompt = PromptTemplate(input_variables=["combined"], template=merge_template)
            summary = run_chain(merge_prompt, {"combined": combined})

        return {
            "success": True,
            "summary": summary,
            "original_length": word_count,
            "summary_length": len(summary.split()),
            "model_used": "llama-3.1-8b-instant",
            "chunked": word_count > 1200,
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


def summarize_pdf(file_bytes: bytes, summary_type: str = "detailed") -> dict:
    try:
        text = extract_text_from_pdf(file_bytes)
        if not text or len(text.split()) < 10:
            return {"success": False, "error": "Could not extract enough text from PDF."}
        result = summarize_text(text, summary_type)
        result["extracted_word_count"] = len(text.split())
        return result
    except Exception as e:
        return {"success": False, "error": str(e)}


# ── Topics + Roadmap ─────────────────────────────────────────────────────────

def extract_topics_and_roadmap(text: str) -> dict:
    try:
        # Hard cap at 1000 words to stay fast
        text = trim_to_words(text, 1000)
        prompt = get_topics_prompt()
        raw = run_chain(prompt, {"text": text})
        raw = re.sub(r"```json|```", "", raw).strip()
        parsed = json.loads(raw)
        return {
            "success": True,
            "topics": parsed.get("topics", []),
            "roadmap": parsed.get("roadmap", {}),
            "model_used": "llama-3.1-8b-instant",
        }
    except json.JSONDecodeError:
        return {"success": False, "error": "Model returned invalid JSON. Try again."}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ── Flowchart ────────────────────────────────────────────────────────────────

def generate_flowchart(text: str) -> dict:
    try:
        # Hard cap at 1500 words — flowchart doesn't need full document
        text = trim_to_words(text, 1500)
        prompt = get_flowchart_prompt()
        raw = run_chain(prompt, {"text": text})
        raw = re.sub(r"```json|```", "", raw).strip()
        parsed = json.loads(raw)
        return {
            "success": True,
            "nodes": parsed.get("nodes", []),
            "final_summary": parsed.get("final_summary", ""),
            "model_used": "llama-3.1-8b-instant",
        }
    except json.JSONDecodeError:
        return {"success": False, "error": "Model returned invalid JSON. Try again."}
    except Exception as e:
        return {"success": False, "error": str(e)}