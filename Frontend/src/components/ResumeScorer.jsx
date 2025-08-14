import { useState } from "react";
import { scoreResume } from "../api";

export default function ResumeScorer() {
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);

  async function onScore() {
    if (!resumeText.trim()) {
      alert("Please paste your resume text first.");
      return;
    }

    try {
      setLoading(true);
      setScore(null);
      
      const result = await scoreResume({
        resume_text: resumeText,
        job_title: jobTitle || undefined,
        job_description: jobDescription || undefined
      });
      
      setScore(result);
    } catch (err) {
      console.error(err);
      alert("Failed to score resume. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return '#10b981';
      case 'B': return '#3b82f6';
      case 'C': return '#f59e0b';
      case 'D': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 70) return '#3b82f6';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={card}>
      <h2>Resume ATS Scorer</h2>
      <p style={{ color: "#6b7280", marginBottom: 16 }}>
        Analyze your resume for ATS (Applicant Tracking System) compatibility and get a score with improvement suggestions.
      </p>

      <div style={grid}>
        <div>
          <label>Resume Text *</label>
          <textarea
            rows={12}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            style={{ width: "100%", fontFamily: "monospace" }}
          />
        </div>

        <div>
          <label>Job Title (optional)</label>
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g., Frontend Developer"
            style={{ width: "100%" }}
          />
          
          <label style={{ marginTop: "16px" }}>Job Description (optional)</label>
          <textarea
            rows={8}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description for keyword matching..."
            style={{ width: "100%", fontFamily: "monospace" }}
          />
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <button 
          onClick={onScore} 
          disabled={loading || !resumeText.trim()}
          style={btn}
        >
          {loading ? "Analyzing..." : "Score Resume"}
        </button>
      </div>

      {score && (
        <div style={{ marginTop: 24 }}>
          <h3>ATS Compatibility Score</h3>
          
          {/* Score Display */}
          <div style={scoreCard}>
            <div style={{ textAlign: "center" }}>
              <div style={{ 
                fontSize: "48px", 
                fontWeight: "bold", 
                color: getGradeColor(score.grade),
                marginBottom: "8px"
              }}>
                {score.grade}
              </div>
              <div style={{ 
                fontSize: "24px", 
                fontWeight: "bold", 
                color: getScoreColor(score.score),
                marginBottom: "8px"
              }}>
                {score.score}/{score.max_score}
              </div>
              <div style={{ color: "#6b7280", fontSize: "14px" }}>
                {score.assessment}
              </div>
            </div>
          </div>

          {/* Detailed Feedback */}
          <div style={{ marginTop: 16 }}>
            <h4>Detailed Analysis</h4>
            <div style={feedbackBox}>
              {score.feedback.map((item, index) => (
                <div key={index} style={feedbackItem}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={statCard}>
              <div style={statNumber}>{score.word_count}</div>
              <div style={statLabel}>Words</div>
            </div>
            <div style={statCard}>
              <div style={statNumber}>{score.bullet_points}</div>
              <div style={statLabel}>Bullet Points</div>
            </div>
          </div>

          {/* Suggestions */}
          {score.suggestions.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h4>Improvement Suggestions</h4>
              <div style={suggestionsBox}>
                {score.suggestions.map((suggestion, index) => (
                  <div key={index} style={suggestionItem}>
                    💡 {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const card = { 
  border: "1px solid #eee", 
  borderRadius: 12, 
  padding: 16, 
  marginBottom: 16 
};

const grid = { 
  display: "grid", 
  gridTemplateColumns: "1fr 1fr", 
  gap: 16 
};

const btn = { 
  padding: "10px 14px", 
  borderRadius: 8, 
  border: 0, 
  background: "#111", 
  color: "#fff", 
  cursor: "pointer" 
};

const scoreCard = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: 24,
  textAlign: "center"
};

const feedbackBox = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: 16
};

const feedbackItem = {
  padding: "8px 0",
  borderBottom: "1px solid #e2e8f0",
  fontSize: "14px"
};

const statCard = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: 16,
  textAlign: "center"
};

const statNumber = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#111"
};

const statLabel = {
  fontSize: "14px",
  color: "#6b7280",
  marginTop: "4px"
};

const suggestionsBox = {
  background: "#fef3c7",
  border: "1px solid #f59e0b",
  borderRadius: 8,
  padding: 16
};

const suggestionItem = {
  padding: "8px 0",
  fontSize: "14px",
  color: "#92400e"
};
