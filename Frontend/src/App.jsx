import { useEffect, useState } from "react";
import { checkHealth } from "./api";
import ResumeBuilder from "./components/ResumeBuilder.jsx";
import CoverLetterForm from "./components/CoverLetterForm.jsx";
import ResumeImprover from "./components/ResumeImprover.jsx";
import ResumeScorer from "./components/ResumeScorer.jsx";

export default function App() {
  const [status, setStatus] = useState("Click to check backend");
  const [activeTab, setActiveTab] = useState("resume");

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif", maxWidth: 1200, margin: "0 auto" }}>
      <h1>Resume & Cover Letter AI Builder 🎉</h1>
      <p>
        Build professional resumes and cover letters with AI assistance.
      </p>

      <Health status={status} setStatus={setStatus} />

      {/* Tab Navigation */}
      <div style={{ marginTop: 32, borderBottom: "1px solid #e5e7eb" }}>
        <button
          onClick={() => setActiveTab("resume")}
          style={{
            padding: "12px 24px",
            border: "none",
            background: activeTab === "resume" ? "#111" : "transparent",
            color: activeTab === "resume" ? "#fff" : "#111",
            cursor: "pointer",
            borderBottom: activeTab === "resume" ? "2px solid #111" : "2px solid transparent"
          }}
        >
          Resume Builder
        </button>
        <button
          onClick={() => setActiveTab("cover-letter")}
          style={{
            padding: "12px 24px",
            border: "none",
            background: activeTab === "cover-letter" ? "#111" : "transparent",
            color: activeTab === "cover-letter" ? "#fff" : "#111",
            cursor: "pointer",
            borderBottom: activeTab === "cover-letter" ? "2px solid #111" : "2px solid transparent"
          }}
        >
          Cover Letter Generator
        </button>
        <button
          onClick={() => setActiveTab("improver")}
          style={{
            padding: "12px 24px",
            border: "none",
            background: activeTab === "improver" ? "#111" : "transparent",
            color: activeTab === "improver" ? "#fff" : "#111",
            cursor: "pointer",
            borderBottom: activeTab === "improver" ? "2px solid #111" : "2px solid transparent"
          }}
        >
          Resume Improver
        </button>
        <button
          onClick={() => setActiveTab("scorer")}
          style={{
            padding: "12px 24px",
            border: "none",
            background: activeTab === "scorer" ? "#111" : "transparent",
            color: activeTab === "scorer" ? "#fff" : "#111",
            cursor: "pointer",
            borderBottom: activeTab === "scorer" ? "2px solid #111" : "2px solid transparent"
          }}
        >
          ATS Scorer
        </button>
      </div>

      {/* Main Content */}
      <div style={{ marginTop: 24 }}>
        {activeTab === "resume" && <ResumeBuilder />}
        {activeTab === "cover-letter" && <CoverLetterForm />}
        {activeTab === "improver" && <ResumeImprover />}
        {activeTab === "scorer" && <ResumeScorer />}
      </div>
    </div>
  );
}

function Health({ status, setStatus }) {
  async function onCheck() {
    try {
      const s = await checkHealth();
      setStatus(`Backend: ${s}`);
    } catch {
      setStatus("Backend not reachable");
    }
  }

  return (
    <div style={{ marginTop: 16, padding: 12, backgroundColor: "#f3f4f6", borderRadius: 8 }}>
      <button onClick={onCheck}>Check backend</button>
      <div style={{ marginTop: 12 }}>{status}</div>
    </div>
  );
}
