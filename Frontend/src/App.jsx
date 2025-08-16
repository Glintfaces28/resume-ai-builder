import { useEffect, useState } from "react";
import { checkHealth } from "./api";
import ResumeBuilder from "./components/ResumeBuilder";
import ResumeForm from "./components/ResumeForm";
import CoverLetterForm from "./components/CoverLetterForm";
import ResumeScorer from "./components/ResumeScorer";

export default function App() {
  const [backendStatus, setBackendStatus] = useState("Testing...");
  const [activeTab, setActiveTab] = useState("resume-builder");

  useEffect(() => {
    async function testBackend() {
      try {
        const status = await checkHealth();
        setBackendStatus(`✅ Backend connected (${status})`);
      } catch (error) {
        setBackendStatus("❌ Backend connection failed");
        console.error("Backend health check failed:", error);
      }
    }
    testBackend();
  }, []);

  const tabs = [
    { id: "resume-builder", label: "Resume Builder", component: ResumeBuilder },
    { id: "resume-improver", label: "Resume Improver", component: ResumeForm },
    { id: "cover-letter", label: "Cover Letter", component: CoverLetterForm },
    { id: "resume-scorer", label: "Resume Scorer", component: ResumeScorer },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif", maxWidth: 1200, margin: "0 auto" }}>
      <h1>Resume & Cover Letter AI Builder 🎉</h1>
      
      {/* Backend Status */}
      <div style={{ marginTop: 16, padding: 12, backgroundColor: "#f3f4f6", borderRadius: 8 }}>
        <p style={{ margin: 0 }}>{backendStatus}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            marginTop: 8, 
            padding: "4px 8px", 
            fontSize: "12px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer"
          }}
        >
          Check Backend
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ marginTop: 24, display: "flex", gap: 8, borderBottom: "1px solid #e5e7eb" }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "12px 16px",
              border: "none",
              background: activeTab === tab.id ? "#3b82f6" : "transparent",
              color: activeTab === tab.id ? "white" : "#374151",
              cursor: "pointer",
              borderRadius: "8px 8px 0 0",
              fontWeight: activeTab === tab.id ? "600" : "400"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Component */}
      <div style={{ marginTop: 24 }}>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}
