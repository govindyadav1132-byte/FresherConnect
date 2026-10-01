from flask import Flask, request, jsonify
from flask_cors import CORS
try:
    from pypdf import PdfReader
except ImportError:
    from PyPDF2 import PdfReader
import re

app = Flask(__name__)
CORS(app)


# =========================================================
# ROLE → REQUIRED SKILLS
# =========================================================

ROLE_SKILLS = {
    "Frontend Developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Git",
    ],

    "Backend Developer": [
        "Python",
        "Java",
        "SQL",
        "Git",
        "Node.js",
    ],

    "Full Stack Developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Node.js",
        "SQL",
        "Git",
    ],

    "Python Developer": [
        "Python",
        "SQL",
        "Git",
        "Flask",
        "Django",
    ],

    "Java Developer": [
        "Java",
        "SQL",
        "Git",
        "Spring",
        "MySQL",
    ],

    "Data Analyst": [
        "Python",
        "SQL",
        "Excel",
        "Statistics",
        "Power BI",
        "Tableau",
    ],

    "Data Scientist": [
        "Python",
        "SQL",
        "Statistics",
        "Pandas",
        "NumPy",
        "Scikit-learn",
        "Machine Learning",
    ],

    "Machine Learning Engineer": [
        "Python",
        "Machine Learning",
        "Pandas",
        "NumPy",
        "Scikit-learn",
        "TensorFlow",
        "PyTorch",
    ],

    "Android Developer": [
        "Java",
        "Kotlin",
        "Android",
        "Android Studio",
        "Git",
    ],
}


# =========================================================
# SKILL ALIASES
# =========================================================

SKILL_ALIASES = {

    "HTML": [
        "html",
        "html5",
    ],

    "CSS": [
        "css",
        "css3",
    ],

    "JavaScript": [
        "javascript",
        "js",
    ],

    "TypeScript": [
        "typescript",
        "ts",
    ],

    "React": [
        "react",
        "reactjs",
        "react.js",
    ],

    "Node.js": [
        "node.js",
        "nodejs",
        "node",
    ],

    "Python": [
        "python",
    ],

    "Java": [
        "java",
    ],

    "SQL": [
        "sql",
    ],

    "Flask": [
        "flask",
    ],

    "Django": [
        "django",
    ],

    "Git": [
        "git",
    ],

    "GitHub": [
        "github",
        "git hub",
    ],

    "MongoDB": [
        "mongodb",
        "mongo db",
    ],

    "PostgreSQL": [
        "postgresql",
        "postgres",
    ],

    "MySQL": [
        "mysql",
    ],

    "Spring": [
        "spring",
        "spring boot",
    ],

    "Kotlin": [
        "kotlin",
    ],

    "Android": [
        "android",
    ],

    "Android Studio": [
        "android studio",
    ],

    "Excel": [
        "excel",
        "microsoft excel",
    ],

    "Data Science": [
        "data science",
    ],

    "Statistics": [
        "statistics",
        "statistical",
    ],

    "Power BI": [
        "power bi",
        "powerbi",
    ],

    "Tableau": [
        "tableau",
    ],

    "Machine Learning": [
        "machine learning",
        "ml",
    ],

    "Artificial Intelligence": [
        "artificial intelligence",
        "ai",
    ],

    "Pandas": [
        "pandas",
    ],

    "NumPy": [
        "numpy",
        "num py",
    ],

    "Scikit-learn": [
        "scikit-learn",
        "scikit learn",
        "sklearn",
    ],

    "TensorFlow": [
        "tensorflow",
    ],

    "PyTorch": [
        "pytorch",
    ],
}


# =========================================================
# LEARNING RECOMMENDATIONS
# =========================================================

RECOMMENDATIONS = {

    "HTML": "Learn HTML5 structure, semantic elements, forms, tables and accessibility.",

    "CSS": "Practice CSS layouts, Flexbox, Grid, responsive design and modern styling.",

    "JavaScript": "Learn JavaScript fundamentals, DOM manipulation, ES6+ and asynchronous programming.",

    "TypeScript": "Learn TypeScript types, interfaces, generics and how to use it with React.",

    "React": "Build React projects using components, props, state, hooks and API integration.",

    "Node.js": "Learn Node.js, Express, REST APIs, middleware and backend development.",

    "Python": "Practice Python fundamentals, functions, OOP, modules and real-world projects.",

    "Java": "Practice Java OOP, collections, exception handling and application development.",

    "SQL": "Practice SELECT queries, joins, grouping, subqueries and database design.",

    "Flask": "Learn Flask routing, APIs, request handling, authentication and database integration.",

    "Django": "Learn Django models, views, URLs, templates, authentication and REST APIs.",

    "Git": "Practice Git branching, commits, merging, pull requests and version control.",

    "GitHub": "Learn GitHub repositories, branches, pull requests and collaborative development.",

    "MongoDB": "Learn MongoDB collections, documents, queries and database integration.",

    "PostgreSQL": "Practice PostgreSQL queries, relational database design and backend integration.",

    "MySQL": "Practice MySQL queries, joins, relationships and database management.",

    "Spring": "Learn Spring Boot, REST APIs, dependency injection and Java backend development.",

    "Kotlin": "Learn Kotlin syntax, OOP, collections and Android application development.",

    "Android": "Build Android applications using activities, layouts, navigation and APIs.",

    "Android Studio": "Practice Android Studio projects using Kotlin/Java and modern Android tools.",

    "Excel": "Practice formulas, pivot tables, charts, data cleaning and analysis.",

    "Statistics": "Learn descriptive statistics, probability, distributions and hypothesis testing.",

    "Power BI": "Learn Power BI dashboards, data transformation, visualizations and DAX.",

    "Tableau": "Practice Tableau dashboards, charts, filters and data visualization.",

    "Machine Learning": "Learn supervised and unsupervised learning algorithms and build ML projects.",

    "Artificial Intelligence": "Learn AI fundamentals, search, machine learning and intelligent systems.",

    "Pandas": "Practice data cleaning, filtering, grouping and analysis using Pandas.",

    "NumPy": "Learn NumPy arrays, mathematical operations and numerical data processing.",

    "Scikit-learn": "Build machine learning models using Scikit-learn preprocessing and algorithms.",

    "TensorFlow": "Learn neural networks, model training and deep learning using TensorFlow.",

    "PyTorch": "Practice neural networks, tensors, training loops and deep learning with PyTorch.",
}


# =========================================================
# SKILL DETECTION
# =========================================================

def skill_exists(text, skill):

    aliases = SKILL_ALIASES.get(skill, [skill.lower()])

    for alias in aliases:

        pattern = (
            r"(?<![a-zA-Z0-9])"
            + re.escape(alias)
            + r"(?![a-zA-Z0-9])"
        )

        if re.search(pattern, text, re.IGNORECASE):
            return True

    return False


# =========================================================
# RESUME QUALITY ANALYSIS
# =========================================================

def analyze_resume_quality(text):

    text_lower = text.lower()

    checks = []

    # Contact information
    email_found = bool(
        re.search(
            r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
            text
        )
    )

    phone_found = bool(
        re.search(
            r"(?:\+91[\s-]?)?[6-9]\d{9}",
            text
        )
    )

    checks.append({
        "name": "Contact Information",
        "status": email_found or phone_found,
        "message": (
            "Email or phone number detected."
            if email_found or phone_found
            else "Add a professional email address and phone number."
        )
    })


    # Education
    education_found = bool(
        re.search(
            r"\b(education|academic|qualification|degree|b\.?sc|b\.?tech|m\.?sc|college|university)\b",
            text_lower
        )
    )

    checks.append({
        "name": "Education",
        "status": education_found,
        "message": (
            "Education information detected."
            if education_found
            else "Add an Education section with your degree and college."
        )
    })


    # Skills
    skills_found = bool(
        re.search(
            r"\b(skills|technical skills|technologies|technical knowledge)\b",
            text_lower
        )
    )

    checks.append({
        "name": "Skills Section",
        "status": skills_found,
        "message": (
            "Skills section detected."
            if skills_found
            else "Add a dedicated Skills section."
        )
    })


    # Projects
    projects_found = bool(
        re.search(
            r"\b(projects|academic projects|personal projects|projects worked on)\b",
            text_lower
        )
    )

    checks.append({
        "name": "Projects",
        "status": projects_found,
        "message": (
            "Projects section detected."
            if projects_found
            else "Add relevant academic or personal projects."
        )
    })


    # Experience
    experience_found = bool(
        re.search(
            r"\b(experience|work experience|internship|internships|employment)\b",
            text_lower
        )
    )

    checks.append({
        "name": "Experience",
        "status": experience_found,
        "message": (
            "Experience information detected."
            if experience_found
            else "Consider adding internships, work experience or practical experience."
        )
    })


    # GitHub / LinkedIn
    github_found = "github.com" in text_lower
    linkedin_found = "linkedin.com" in text_lower

    checks.append({
        "name": "Professional Links",
        "status": github_found or linkedin_found,
        "message": (
            "GitHub or LinkedIn profile detected."
            if github_found or linkedin_found
            else "Consider adding GitHub and LinkedIn profiles."
        )
    })


    # Resume length/content
    word_count = len(text.split())

    good_length = word_count >= 150

    checks.append({
        "name": "Resume Content",
        "status": good_length,
        "message": (
            f"Resume contains approximately {word_count} words."
            if good_length
            else f"Resume contains only approximately {word_count} words. Add more relevant details."
        )
    })


    passed = sum(
        1 for check in checks
        if check["status"]
    )

    quality_score = round(
        (passed / len(checks)) * 100
    )


    return {
        "quality_score": quality_score,
        "checks": checks,
        "word_count": word_count,
        "email_found": email_found,
        "phone_found": phone_found,
        "github_found": github_found,
        "linkedin_found": linkedin_found,
    }


# =========================================================
# DETAILED SKILL CATEGORIZATION (Proposal Objective)
# =========================================================

def categorize_skills(text, required_skills):
    """
    Categorizes skills into:
    - matched: found in resume
    - demonstrated: found with practical context (projects, developed, internship, etc.)
    - weak: mentioned only once in passing without clear depth
    - missing: not found
    """
    matched = []
    demonstrated = []
    weak = []
    missing = []

    text_lower = text.lower()
    practical_keywords = [
        "project", "projects", "built", "developed", "implemented", "created",
        "designed", "application", "app", "internship", "worked", "experience",
        "github", "system", "api", "database", "model", "pipeline", "component"
    ]

    for skill in required_skills:
        aliases = SKILL_ALIASES.get(skill, [skill.lower()])
        matches = []
        for alias in aliases:
            pattern = r"(?<![a-zA-Z0-9])" + re.escape(alias) + r"(?![a-zA-Z0-9])"
            for m in re.finditer(pattern, text, re.IGNORECASE):
                matches.append(m)

        if not matches:
            missing.append(skill)
        else:
            is_demonstrated = False
            for m in matches:
                start = max(0, m.start() - 150)
                end = min(len(text), m.end() + 150)
                context = text_lower[start:end]
                if any(kw in context for kw in practical_keywords):
                    is_demonstrated = True
                    break

            if is_demonstrated:
                demonstrated.append(skill)
                matched.append(skill)
            elif len(matches) == 1:
                weak.append(skill)
                matched.append(skill)
            else:
                matched.append(skill)

    return {
        "matched": matched,
        "demonstrated": demonstrated,
        "weak": weak,
        "missing": missing,
    }


# =========================================================
# RESUME ANALYSIS API
# =========================================================

@app.route("/analyze-resume", methods=["POST"])
def analyze_resume():

    if "resume" not in request.files:
        return jsonify({
            "error": "No resume file uploaded."
        }), 400


    file = request.files["resume"]

    if file.filename == "":
        return jsonify({
            "error": "No resume selected."
        }), 400


    if not file.filename.lower().endswith(".pdf"):
        return jsonify({
            "error": "Please upload a PDF file."
        }), 400


    role = request.form.get("role", "").strip()

    if not role:
        return jsonify({
            "error": "Please select a target job role."
        }), 400


    if role not in ROLE_SKILLS:
        return jsonify({
            "error": "Invalid job role selected."
        }), 400


    try:
        pages = 0
        extracted_text = ""

        # Try PdfReader (PyPDF2 / pypdf)
        reader = PdfReader(file)
        pages = len(reader.pages)

        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                extracted_text += page_text + "\n"

        if not extracted_text.strip():
            return jsonify({
                "error": "Could not extract text from the PDF. Please check if the file is scanned or empty."
            }), 400


        # =================================================
        # EXPLAINABLE SKILL ANALYSIS (PROPOSAL OBJECTIVE)
        # =================================================

        required_skills = ROLE_SKILLS[role]
        categorized = categorize_skills(extracted_text, required_skills)

        found_skills = categorized["matched"]
        demonstrated_skills = categorized["demonstrated"]
        weak_skills = categorized["weak"]
        missing_skills = categorized["missing"]

        # Resume Quality Analysis
        resume_quality = analyze_resume_quality(extracted_text)
        quality_score = resume_quality["quality_score"]

        # Explainable 0-100 Match Score:
        # 60% skill presence + 20% practical evidence + 20% structure/completeness
        skill_coverage_ratio = len(found_skills) / len(required_skills)
        demo_ratio = (len(demonstrated_skills) / len(required_skills)) if required_skills else 0
        quality_ratio = quality_score / 100

        skill_score = round(
            (skill_coverage_ratio * 60) + (demo_ratio * 20) + (quality_ratio * 20)
        )
        skill_score = min(100, max(0, skill_score))


        # =================================================
        # LEARNING RECOMMENDATIONS
        # =================================================

        recommendations = []

        for skill in missing_skills:
            recommendations.append({
                "skill": skill,
                "status": "Missing",
                "recommendation": RECOMMENDATIONS.get(
                    skill,
                    f"Learn and practice {skill} through projects and tutorials."
                )
            })

        for skill in weak_skills:
            recommendations.append({
                "skill": skill,
                "status": "Needs Practice",
                "recommendation": f"Add project evidence or practical implementation of {skill} to strengthen your resume."
            })


        # =================================================
        # FINAL RESPONSE
        # =================================================

        return jsonify({
            "message": "Resume analyzed successfully!",
            "filename": file.filename,
            "pages": pages,
            "role": role,
            "required_skills": required_skills,
            "skills": found_skills,
            "demonstrated_skills": demonstrated_skills,
            "weak_skills": weak_skills,
            "missing_skills": missing_skills,
            "skill_score": skill_score,
            "recommendations": recommendations,
            "resume_quality": resume_quality,
            "quality_score": quality_score,
            "extracted_text": extracted_text,
        })


    except Exception as error:

        print("Resume analysis error:", error)

        return jsonify({
            "error": "Something went wrong while analyzing the resume."
        }), 500


# =========================================================
# RUN SERVER
# =========================================================

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )