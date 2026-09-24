from flask import Flask, request, jsonify
from flask_cors import CORS
from pypdf import PdfReader
import os

app = Flask(__name__)
CORS(app)

# Maximum resume size: 5 MB
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024


@app.route("/")
def home():
    return jsonify({
        "message": "FresherConnect Backend is running!"
    })


@app.route("/analyze-resume", methods=["POST"])
def analyze_resume():

    # Check if a file was uploaded
    if "resume" not in request.files:
        return jsonify({
            "error": "No resume file uploaded."
        }), 400

    resume = request.files["resume"]

    # Check filename
    if resume.filename == "":
        return jsonify({
            "error": "No file selected."
        }), 400

    # Only allow PDF
    if not resume.filename.lower().endswith(".pdf"):
        return jsonify({
            "error": "Only PDF files are allowed."
        }), 400

    try:
        # Read PDF directly
        reader = PdfReader(resume)

        extracted_text = ""

        for page in reader.pages:
            text = page.extract_text()

            if text:
                extracted_text += text + "\n"

        # Check if text was extracted
        if not extracted_text.strip():
            return jsonify({
                "error": "Could not extract text from this PDF."
            }), 400

        # Basic skill detection
        skills_database = [
            "Python",
            "Java",
            "JavaScript",
            "React",
            "HTML",
            "CSS",
            "SQL",
            "C",
            "C++",
            "C#",
            "Flask",
            "Django",
            "Node.js",
            "Git",
            "GitHub",
            "Machine Learning",
            "Data Science",
            "Artificial Intelligence",
            "Android",
            "Android Studio",
            "MongoDB",
            "MySQL",
            "PostgreSQL",
            "AWS",
            "Docker"
        ]

        detected_skills = []

        text_lower = extracted_text.lower()

        for skill in skills_database:
            if skill.lower() in text_lower:
                detected_skills.append(skill)

        return jsonify({
            "message": "Resume analyzed successfully!",
            "filename": resume.filename,
            "pages": len(reader.pages),
            "extracted_text": extracted_text,
            "skills": detected_skills
        })

    except Exception as e:
        return jsonify({
            "error": "Error processing resume.",
            "details": str(e)
        }), 500


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )