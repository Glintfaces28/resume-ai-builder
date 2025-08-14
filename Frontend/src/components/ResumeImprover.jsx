import { useState } from "react";
import { improveResume } from "../api";
import { downloadTextAsPDF } from "../utils/pdf";

export default function ResumeImprover() {
  const [resumeText, setResumeText] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [improvedText, setImprovedText] = useState("");

  async function onImprove() {
    if (!resumeText.trim()) {
      alert("Please paste your resume text first.");
      return;
    }

    try {
      setLoading(true);
      setImprovedText("");
      
      const result = await improveResume({
        text: resumeText,
        tone: tone
      });
      
      setImprovedText(result);
    } catch (err) {
      console.error(err);
      alert("Failed to improve resume. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={card}>
      <h2>Resume Improver</h2>
      <p style={{ color: "#6b7280", marginBottom: 16 }}>
        Paste your resume and get intelligent suggestions to make it more impactful and professional.
      </p>

      <div style={grid}>
        <div>
          <label>Resume Text</label>
          <textarea
            rows={12}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            style={{ width: "100%", fontFamily: "monospace" }}
          />
        </div>

        <div>
          <label>Tone</label>
          <select 
            value={tone} 
            onChange={(e) => setTone(e.target.value)}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #d1d5db" }}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="creative">Creative</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button 
          onClick={onImprove} 
          disabled={loading || !resumeText.trim()}
          style={btn}
        >
          {loading ? "Improving..." : "Improve Resume"}
        </button>
        
        {improvedText && (
          <>
            <button
              onClick={() => navigator.clipboard.writeText(improvedText)}
              style={btnLight}
            >
              Copy Improved
            </button>
            <button
              onClick={() => downloadTextAsPDF("improved-resume.pdf", "Improved Resume", improvedText)}
              style={btnLight}
            >
              Download PDF
            </button>
          </>
        )}
      </div>

      {improvedText && (
        <div style={{ marginTop: 16 }}>
          <h3>Improved Resume</h3>
          <div style={outputBox}>
            <pre style={{ whiteSpace: "pre-wrap", margin: 0, fontFamily: "monospace" }}>
              {improvedText}
            </pre>
          </div>
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

const btnLight = { 
  ...btn, 
  background: "#f1f1f1", 
  color: "#111" 
};

const outputBox = { 
  background: "#fafafa", 
  border: "1px solid #eee", 
  padding: 12, 
  borderRadius: 8 
};
