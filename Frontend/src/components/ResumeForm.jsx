
import { useState } from "react";
import { improveResume } from "../api";
import { downloadTextAsPDF } from "../utils/pdf";

export default function ResumeForm() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    if (!text || text.trim().length < 20) {
      alert("Please paste at least 20 characters of resume text.");
      return;
    }
    try {
      setLoading(true);
      const improved = await improveResume({ text, tone });
      setOutput(improved);
    } catch {
      alert("Failed to improve resume. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={card}>
      <h2>AI Resume Improver</h2>
      <form onSubmit={onSubmit} style={grid}>
        <label>Resume Text</label>
        <textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your resume here…"
        />

        <label>Tone</label>
        <input
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          placeholder="professional / friendly / confident"
        />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="submit" style={btn} disabled={loading}>
            {loading ? "Improving…" : "Improve Resume"}
          </button>

          {output && (
            <>
              <button
                type="button"
                style={btnLight}
                onClick={() => navigator.clipboard.writeText(output)}
              >
                Copy
              </button>
              <button
                type="button"
                style={btnLight}
                onClick={() =>
                  downloadTextAsPDF("improved-resume.pdf", "Improved Resume", output)
                }
              >
                Download PDF
              </button>
            </>
          )}
        </div>
      </form>

      {output && (
        <>
          <h3>Result</h3>
          <pre style={outputBox}>{output}</pre>
        </>
      )}
    </div>
  );
}

const card = { border: "1px solid #eee", borderRadius: 12, padding: 16, marginBottom: 16 };
const grid = { display: "grid", gap: 8 };
const btn = { padding: "10px 14px", borderRadius: 8, border: 0, background: "#111", color: "#fff", cursor: "pointer" };
const btnLight = { ...btn, background: "#f1f1f1", color: "#111" };
const outputBox = { whiteSpace: "pre-wrap", background: "#fafafa", border: "1px solid #eee", padding: 12, borderRadius: 8 };
