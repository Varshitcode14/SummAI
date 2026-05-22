from flask import Flask
from flask_cors import CORS
from routes.summarize import summarize_bp

app = Flask(__name__)

CORS(app, origins=["*"])  # allow all for now, we'll restrict later

app.register_blueprint(summarize_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=False, port=5000)