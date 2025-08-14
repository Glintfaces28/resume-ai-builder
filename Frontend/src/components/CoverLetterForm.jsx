import { useState } from "react";
import { generateCoverLetter } from "../api";
import { downloadTextAsPDF } from "../utils/pdf";

export default function CoverLetterForm() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    if (
      jobTitle.trim().length < 2 ||
      jobDescription.trim().length < 20 ||
      resumeText.trim().length < 20
    ) {
      alert("Please fill in realistic sample data (job + description + resume).");
      return;
    }
    try {
      setLoading(true);
      const letter = await generateCoverLetter({
        resumeText,
        jobTitle,
        jobDescription,
        company,
      });
      setOutput(letter);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={card}>
      <h2>Cover Letter Generator</h2>
      <form onSubmit={onSubmit} style={grid}>
        <label>Job Title</label>
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g., Frontend Developer"
        />

        <label>Company (optional)</label>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company name"
        />

        <label>Job Description</label>
        <textarea
          rows={6}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description…"
        />

        <label>Your Resume (paste)</label>
        <textarea
          rows={6}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume…"
        />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="submit" style={btn} disabled={loading}>
            {loading ? "Generating…" : "Generate Letter"}
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
                  downloadTextAsPDF("cover-letter.pdf", "Cover Letter", output)
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
