#!/usr/bin/env python3
"""
Complete FastAPI application for Railway deployment
"""
from typing import List, Optional
import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel, Field

app = FastAPI(title="Resume & Cover Letter AI Builder", version="0.1.0")

@app.get("/")
def root():
    return {"message": "Resume AI Builder API", "status": "running"}

# --- CORS (Netlify + local dev) ---
_ALLOWED_ORIGINS = list(filter(None, [
    os.getenv("FRONTEND_URL"),                # e.g. https://sparkling-maamoul-3ec031.netlify.app
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://sparkling-maamoul-3ec031.netlify.app",  # Your specific Netlify domain
]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Health ----------
@app.get("/api/health")
def health():
    return {"status": "ok", "message": "API health check"}

# ---------- Models for /api/generate-resume ----------
class Experience(BaseModel):
    role: str
    company: str
    start: str = Field(..., description="YYYY-MM or year")
    end: Optional[str] = Field(None, description="YYYY-MM, year or 'Present'")
    achievements: List[str] = []

class Education(BaseModel):
    school: str
    start: str
    end: Optional[str] = None
    degree: Optional[str] = None

class GenerateResumeRequest(BaseModel):
    full_name: str
    target_title: str
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    links: Optional[str] = None  # comma or space separated
    summary: Optional[str] = None
    experiences: List[Experience] = []
    education: List[Education] = []
    skills: Optional[str] = None  # comma separated

def _bullets(items: List[str]) -> str:
    return "\n".join(f"- {i}" for i in items if (i or "").strip())

# ---------- /api/generate-resume ----------
@app.post("/api/generate-resume", response_class=PlainTextResponse)
def generate_resume(body: GenerateResumeRequest):
    parts: List[str] = []

    # Header
    header = [body.full_name, body.target_title]
    contact = []
    if body.email: contact.append(body.email)
    if body.phone: contact.append(body.phone)
    if body.location: contact.append(body.location)
    if body.links: contact.append(body.links)
    if contact:
        header.append(" | ".join(contact))
    parts.append("\n".join(h for h in header if h))

    # Summary
    if body.summary and body.summary.strip():
        parts.append("Summary\n-------\n" + body.summary.strip())

    # Experience
    if body.experiences:
        sec = ["Experience\n----------"]
        for exp in body.experiences:
            title = f"{exp.role} — {exp.company} ({exp.start} – {exp.end or 'Present'})"
            sec.append(title)
            if exp.achievements:
                sec.append(_bullets(exp.achievements))
        parts.append("\n".join(sec))

    # Education
    if body.education:
        sec = ["Education\n---------"]
        for ed in body.education:
            degree = f", {ed.degree}" if ed.degree else ""
            line = f"{ed.school}{degree} ({ed.start} – {ed.end or ''})".strip()
            sec.append(line)
        parts.append("\n".join(sec))

    # Skills
    if body.skills and body.skills.strip():
        skills_clean = ", ".join(s.strip() for s in body.skills.split(",") if s.strip())
        parts.append("Skills\n------\n" + skills_clean)

    result = "\n\n".join(p for p in parts if p.strip())
    return result or "No data provided."

# ---------- Optional stubs you already used earlier ----------
class ImproveBody(BaseModel):
    text: str
    tone: Optional[str] = "professional"

@app.post("/api/improve-resume", response_class=PlainTextResponse)
def improve_resume(body: ImproveBody):
    # Trim lines and remove blanks
    lines = [ln.strip() for ln in body.text.splitlines() if ln.strip()]
    
    # Apply improvements based on tone
    improved_lines = []
    
    for line in lines:
        improved_line = line
        
        # Make action verbs more impactful
        action_verb_improvements = {
            "did": "accomplished",
            "made": "created",
            "worked on": "developed",
            "helped": "assisted",
            "used": "implemented",
            "did work": "executed",
            "was responsible for": "managed",
            "looked after": "oversaw",
            "did stuff": "performed",
            "fixed": "resolved",
            "changed": "transformed",
            "got": "achieved",
            "put in": "implemented",
            "set up": "established",
            "ran": "managed"
        }
        
        for weak_verb, strong_verb in action_verb_improvements.items():
            if weak_verb in improved_line.lower():
                improved_line = improved_line.replace(weak_verb, strong_verb)
                improved_line = improved_line.replace(weak_verb.title(), strong_verb.title())
        
        # Add quantifiable results if missing
        if any(word in improved_line.lower() for word in ["increased", "decreased", "improved", "reduced", "grew", "achieved"]):
            # Line already has metrics, keep as is
            pass
        elif any(word in improved_line.lower() for word in ["developed", "created", "built", "implemented", "designed"]):
            # Suggest adding metrics
            if not any(char.isdigit() for char in improved_line):
                improved_line += " (consider adding specific metrics)"
        
        # Make it more professional if needed
        if body.tone == "professional":
            # Remove casual language
            casual_words = ["cool", "awesome", "great", "nice", "good", "stuff", "things"]
            for word in casual_words:
                if word in improved_line.lower():
                    improved_line = improved_line.replace(word, "excellent")
                    improved_line = improved_line.replace(word.title(), "Excellent")
        
        improved_lines.append(improved_line)
    
    result = "\n".join(improved_lines)
    
    # Add improvement suggestions at the end
    suggestions = []
    
    # Check for common resume issues
    if not any(char.isdigit() for char in body.text):
        suggestions.append("💡 Consider adding quantifiable achievements (e.g., 'increased sales by 25%')")
    
    if len([line for line in lines if line.startswith("-") or line.startswith("•")]) < 3:
        suggestions.append("💡 Add more bullet points to highlight specific achievements")
    
    if not any(word in body.text.lower() for word in ["led", "managed", "coordinated", "supervised"]):
        suggestions.append("💡 Include leadership experiences if applicable")
    
    if suggestions:
        result += "\n\n" + "\n".join(suggestions)
    
    return result

class CoverLetterBody(BaseModel):
    job_title: str
    company: Optional[str] = None
    job_description: Optional[str] = None
    resume_text: Optional[str] = None

@app.post("/api/cover-letter", response_class=PlainTextResponse)
def cover_letter(body: CoverLetterBody):
    company = body.company or "the company"
    
    # Extract key skills from resume if provided
    resume_skills = []
    if body.resume_text:
        # Simple skill extraction - look for common tech terms
        common_skills = ["react", "python", "javascript", "typescript", "node", "sql", "aws", "docker", "git", "html", "css", "java", "c++", "php", "ruby", "go", "rust", "swift", "kotlin", "angular", "vue", "django", "flask", "express", "mongodb", "postgresql", "mysql", "redis", "kubernetes", "jenkins", "agile", "scrum"]
        resume_lower = body.resume_text.lower()
        resume_skills = [skill for skill in common_skills if skill in resume_lower]
    
    # Generate a more personalized cover letter
    intro = f"Dear Hiring Manager,\n\n"
    intro += f"I am writing to express my strong interest in the {body.job_title} position at {company}. "
    
    if body.job_description:
        intro += f"After reviewing the job description, I am excited about the opportunity to contribute to your team and believe my background aligns well with your requirements.\n\n"
    else:
        intro += f"I am excited about the opportunity to contribute to your team and believe my background would be a great fit for this role.\n\n"
    
    # Body paragraph
    body_text = "Throughout my career, I have demonstrated a strong ability to "
    if resume_skills:
        body_text += f"work with technologies such as {', '.join(resume_skills[:3])} and "
    body_text += "deliver high-quality solutions that meet business objectives. "
    
    if body.job_description:
        body_text += "I am particularly drawn to this role because it offers the opportunity to "
        # Extract some key phrases from job description
        job_desc_lower = body.job_description.lower()
        if any(word in job_desc_lower for word in ["team", "collaborate", "lead"]):
            body_text += "work collaboratively with a talented team and potentially take on leadership responsibilities. "
        elif any(word in job_desc_lower for word in ["innovate", "create", "build"]):
            body_text += "innovate and build impactful solutions that drive business growth. "
        else:
            body_text += "apply my technical skills while contributing to meaningful projects. "
    else:
        body_text += "I am confident that my technical skills and professional experience would enable me to make immediate contributions to your organization. "
    
    # Closing
    closing = f"\nI am excited about the possibility of joining {company} and would welcome the opportunity to discuss how my background, skills, and enthusiasm would make me a valuable addition to your team. I am available for an interview at your convenience and look forward to hearing from you.\n\n"
    closing += "Thank you for considering my application.\n\n"
    closing += "Sincerely,\n[Your Name]"
    
    return intro + body_text + closing

class ResumeScoreBody(BaseModel):
    resume_text: str
    job_title: Optional[str] = None
    job_description: Optional[str] = None

@app.post("/api/score-resume")
def score_resume(body: ResumeScoreBody):
    """Score resume for ATS compatibility and provide improvement suggestions"""
    
    score = 0
    max_score = 100
    feedback = []
    suggestions = []
    
    text = body.resume_text.lower()
    lines = body.resume_text.split('\n')
    
    # Check for essential sections (20 points)
    sections = {
        'contact': ['email', 'phone', '@', '+1', 'linkedin'],
        'experience': ['experience', 'work history', 'employment'],
        'education': ['education', 'degree', 'university', 'college'],
        'skills': ['skills', 'technologies', 'programming', 'languages']
    }
    
    section_score = 0
    for section, keywords in sections.items():
        if any(keyword in text for keyword in keywords):
            section_score += 5
        else:
            suggestions.append(f"Add a {section} section")
    
    score += section_score
    feedback.append(f"Section completeness: {section_score}/20 points")
    
    # Check for action verbs (15 points)
    action_verbs = [
        'developed', 'implemented', 'created', 'designed', 'managed', 'led',
        'increased', 'improved', 'reduced', 'achieved', 'delivered', 'built',
        'maintained', 'coordinated', 'supervised', 'trained', 'analyzed'
    ]
    
    action_verb_count = sum(1 for verb in action_verbs if verb in text)
    action_verb_score = min(15, action_verb_count * 2)
    score += action_verb_score
    feedback.append(f"Action verbs: {action_verb_score}/15 points ({action_verb_count} found)")
    
    if action_verb_count < 5:
        suggestions.append("Use more action verbs to describe your achievements")
    
    # Check for quantifiable achievements (20 points)
    numbers = ['%', 'percent', 'million', 'thousand', 'hundred', 'dozen']
    has_numbers = any(num in text for num in numbers) or any(char.isdigit() for char in text)
    
    if has_numbers:
        score += 20
        feedback.append("Quantifiable achievements: 20/20 points")
    else:
        feedback.append("Quantifiable achievements: 0/20 points")
        suggestions.append("Add specific numbers and percentages to your achievements")
    
    # Check for keywords if job description provided (25 points)
    if body.job_description:
        job_desc_lower = body.job_description.lower()
        job_keywords = set()
        
        # Extract common keywords from job description
        common_keywords = [
            'react', 'python', 'javascript', 'java', 'sql', 'aws', 'docker',
            'kubernetes', 'agile', 'scrum', 'git', 'api', 'rest', 'html',
            'css', 'node', 'typescript', 'angular', 'vue', 'django', 'flask',
            'mongodb', 'postgresql', 'mysql', 'redis', 'jenkins', 'ci/cd',
            'machine learning', 'ai', 'data science', 'analytics', 'testing',
            'devops', 'cloud', 'microservices', 'leadership', 'management'
        ]
        
        for keyword in common_keywords:
            if keyword in job_desc_lower:
                job_keywords.add(keyword)
        
        # Count matching keywords in resume
        matching_keywords = sum(1 for keyword in job_keywords if keyword in text)
        keyword_score = min(25, matching_keywords * 2)
        score += keyword_score
        feedback.append(f"Keyword matching: {keyword_score}/25 points ({matching_keywords} matches)")
        
        if matching_keywords < 5:
            suggestions.append(f"Include more keywords from the job description: {', '.join(list(job_keywords)[:10])}")
    
    # Check formatting and length (20 points)
    # Good length: 1-2 pages (roughly 400-800 words)
    word_count = len(text.split())
    if 300 <= word_count <= 800:
        score += 10
        feedback.append("Resume length: 10/10 points")
    elif word_count < 300:
        feedback.append("Resume length: 5/10 points (too short)")
        suggestions.append("Add more details to your experience and achievements")
    else:
        feedback.append("Resume length: 5/10 points (too long)")
        suggestions.append("Condense your resume to 1-2 pages")
    
    # Check for bullet points
    bullet_points = sum(1 for line in lines if line.strip().startswith(('-', '•', '*', '→')))
    if bullet_points >= 5:
        score += 10
        feedback.append("Bullet points: 10/10 points")
    else:
        feedback.append("Bullet points: 5/10 points")
        suggestions.append("Use more bullet points to highlight achievements")
    
    # Overall assessment
    if score >= 80:
        grade = "A"
        assessment = "Excellent! Your resume is well-optimized for ATS systems."
    elif score >= 70:
        grade = "B"
        assessment = "Good! Your resume has solid ATS compatibility with room for improvement."
    elif score >= 60:
        grade = "C"
        assessment = "Fair. Your resume needs some improvements to pass ATS screening."
    else:
        grade = "D"
        assessment = "Needs significant improvement to pass ATS screening."
    
    return {
        "score": score,
        "max_score": max_score,
        "grade": grade,
        "assessment": assessment,
        "feedback": feedback,
        "suggestions": suggestions,
        "word_count": word_count,
        "bullet_points": bullet_points
    }

# --- Health check & simple debug ---
@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/debug/origin")
def debug_origin():
    # Useful to see what origin and headers the server receives
    return {"frontend_url_env": os.getenv("FRONTEND_URL")}

@app.get("/debug/info")
def debug_info():
    return {
        "frontend_url_env": os.getenv("FRONTEND_URL"),
        "allowed_origins": _ALLOWED_ORIGINS,
        "python_version": sys.version,
        "fastapi_version": "0.110+"
    }

# --- Server startup ---
if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Starting Resume AI Builder backend on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port) 