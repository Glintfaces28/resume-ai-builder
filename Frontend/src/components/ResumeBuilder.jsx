import { useState } from "react";
import { generateResume } from "../api";
import { downloadTextAsPDF } from "../utils/pdf";
import { templates, getTemplateNames } from "../utils/templates";

export default function ResumeBuilder() {
  const [form, setForm] = useState({
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    links: "",
    summary: "",
    experiences: [
      { role: "", company: "", start: "", end: "", achievements: "" },
    ],
    education: [{ school: "", start: "", end: "" }],
    skills: "",
  });

  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const updateArray = (key, idx, field, value) => {
    setForm((f) => {
      const arr = [...f[key]];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...f, [key]: arr };
    });
  };

  const addItem = (key, item) => setForm((f) => ({ ...f, [key]: [...f[key], item] }));
  const removeItem = (key, idx) =>
    setForm((f) => ({ ...f, [key]: f[key].filter((_, i) => i !== idx) }));

  // Load sample data for testing
  const loadSampleData = () => {
    setForm({
      fullName: "Jane Doe",
      title: "Frontend Developer",
      email: "jane.doe@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      links: "linkedin.com/in/janedoe, github.com/janedoe",
      summary: "Experienced frontend developer with 3+ years building responsive web applications using React, TypeScript, and modern CSS. Passionate about creating intuitive user experiences and writing clean, maintainable code.",
      experiences: [
        {
          role: "Frontend Developer",
          company: "TechCorp Inc.",
          start: "2022-01",
          end: "Present",
          achievements: "Led development of company's main product dashboard using React and TypeScript\nImproved application performance by 40% through code optimization and lazy loading\nMentored 2 junior developers and conducted code reviews\nImplemented comprehensive testing suite with Jest and React Testing Library"
        },
        {
          role: "Junior Developer",
          company: "StartupXYZ",
          start: "2021-03",
          end: "2021-12",
          achievements: "Built responsive landing pages and user authentication system\nCollaborated with design team to implement pixel-perfect UI components\nReduced bundle size by 25% through code splitting and optimization"
        }
      ],
      education: [
        {
          school: "University of Technology",
          start: "2017",
          end: "2021",
        }
      ],
      skills: "React, TypeScript, JavaScript, CSS3, HTML5, Git, REST APIs, Jest, Node.js, Webpack",
    });
  };

  // Generate preview using selected template
  const generatePreview = () => {
    const template = templates[selectedTemplate];
    const payload = {
      full_name: form.fullName,
      target_title: form.title,
      email: form.email,
      phone: form.phone,
      location: form.location,
      links: form.links,
      summary: form.summary,
      experiences: form.experiences.map((e) => ({
        role: e.role,
        company: e.company,
        start: e.start,
        end: e.end,
        achievements: e.achievements
          .split("\n")
          .map((ln) => ln.trim())
          .filter(Boolean),
      })),
      education: form.education.map((e) => ({
        school: e.school,
        start: e.start,
        end: e.end,
      })),
      skills: form.skills,
    };
    return template.format(payload);
  };

  async function onGenerate() {
    try {
      setLoading(true);
      setResult("");

      // Build payload for backend contract
      const payload = {
        full_name: form.fullName,
        target_title: form.title,
        email: form.email,
        phone: form.phone,
        location: form.location,
        links: form.links,
        summary: form.summary,
        experiences: form.experiences.map((e) => ({
          role: e.role,
          company: e.company,
          start: e.start,
          end: e.end,
          achievements: e.achievements
            .split("\n")
            .map((ln) => ln.trim())
            .filter(Boolean),
        })),
        education: form.education.map((e) => ({
          school: e.school,
          start: e.start,
          end: e.end,
        })),
        skills: form.skills,
      };

      const resumeText = await generateResume(payload);
      setResult(resumeText || "(No text returned)");
    } catch (err) {
      console.error(err);
      alert("Failed to generate resume. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  const preview = generatePreview();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {/* Form Section */}
      <div>
        <h2>Resume Information</h2>
        
        {/* Template Selection */}
        <div style={{ marginBottom: 24 }}>
          <label>Template Style</label>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {getTemplateNames().map((templateKey) => {
              const template = templates[templateKey];
              return (
                <button
                  key={templateKey}
                  onClick={() => setSelectedTemplate(templateKey)}
                  style={{
                    padding: "8px 16px",
                    border: selectedTemplate === templateKey ? "2px solid #111" : "1px solid #d1d5db",
                    background: selectedTemplate === templateKey ? "#111" : "#fff",
                    color: selectedTemplate === templateKey ? "#fff" : "#111",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  {template.name}
                </button>
              );
            })}
          </div>
          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: 4 }}>
            {templates[selectedTemplate].description}
          </p>
        </div>

        <Grid>
          <div>
            <label>Full Name</label>
            <input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
          </div>
          <div>
            <label>Target Title</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g., Frontend Developer" />
          </div>
          <div>
            <label>Email</label>
            <input value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <label>Location</label>
            <input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="City, Country" />
          </div>
          <div>
            <label>Links (comma-separated)</label>
            <input value={form.links} onChange={(e) => set("links", e.target.value)} placeholder="linkedin.com/in/you, github.com/you" />
          </div>
        </Grid>

        <div style={{ marginTop: 12 }}>
          <label>Professional Summary (optional)</label>
          <textarea rows={3} value={form.summary} onChange={(e) => set("summary", e.target.value)} placeholder="2–3 lines summarizing your value…" />
        </div>

        <h3 style={{ marginTop: 16 }}>Experience</h3>
        {form.experiences.map((e, i) => (
          <div key={i} style={box}>
            <Grid>
              <div>
                <label>Role</label>
                <input value={e.role} onChange={(ev) => updateArray("experiences", i, "role", ev.target.value)} />
              </div>
              <div>
                <label>Company</label>
                <input value={e.company} onChange={(ev) => updateArray("experiences", i, "company", ev.target.value)} />
              </div>
              <div>
                <label>Start (e.g., 2021-01)</label>
                <input value={e.start} onChange={(ev) => updateArray("experiences", i, "start", ev.target.value)} />
              </div>
              <div>
                <label>End (e.g., Present or 2024-05)</label>
                <input value={e.end} onChange={(ev) => updateArray("experiences", i, "end", ev.target.value)} />
              </div>
            </Grid>
            <div>
              <label>Achievements (one per line)</label>
              <textarea
                rows={4}
                value={e.achievements}
                onChange={(ev) => updateArray("experiences", i, "achievements", ev.target.value)}
                placeholder="- Increased monthly sales by 18%\n- Created Jest/RTL tests…"
              />
            </div>
            {form.experiences.length > 1 && (
              <button onClick={() => removeItem("experiences", i)} style={dangerBtn}>Remove Experience</button>
            )}
          </div>
        ))}
        <button onClick={() => addItem("experiences", { role: "", company: "", start: "", end: "", achievements: "" })}>
          + Add Experience
        </button>

        <h3 style={{ marginTop: 16 }}>Education</h3>
        {form.education.map((e, i) => (
          <div key={i} style={box}>
            <Grid>
              <div>
                <label>School</label>
                <input value={e.school} onChange={(ev) => updateArray("education", i, "school", ev.target.value)} />
              </div>
              <div>
                <label>Start</label>
                <input value={e.start} onChange={(ev) => updateArray("education", i, "start", ev.target.value)} />
              </div>
              <div>
                <label>End</label>
                <input value={e.end} onChange={(ev) => updateArray("education", i, "end", ev.target.value)} />
              </div>
            </Grid>
            {form.education.length > 1 && (
              <button onClick={() => removeItem("education", i)} style={dangerBtn}>Remove Education</button>
            )}
          </div>
        ))}
        <button onClick={() => addItem("education", { school: "", start: "", end: "" })}>
          + Add Education
        </button>

        <div style={{ marginTop: 12 }}>
          <label>Skills (comma-separated)</label>
          <input value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="React, TypeScript, REST, Git…" />
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button disabled={loading} onClick={onGenerate} style={primaryBtn}>
            {loading ? "Generating…" : "Generate Resume"}
          </button>
          <button onClick={() => setShowPreview(!showPreview)} style={secondaryBtn}>
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
          <button onClick={loadSampleData} style={secondaryBtn}>
            Load Sample Data
          </button>
        </div>

        {result && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                style={actionBtn}
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => downloadTextAsPDF("resume.pdf", "Resume", result)}
                style={actionBtn}
              >
                Download PDF
              </button>
            </div>
            <label>Generated Result</label>
            <textarea rows={16} value={result} readOnly />
          </div>
        )}
      </div>

      {/* Preview Section */}
      {showPreview && (
        <div>
          <h2>Live Preview</h2>
          <div style={previewBox}>
            <pre style={previewText}>{preview}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

const Grid = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
    {children}
  </div>
);

const box = {
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  padding: 12,
  marginBottom: 12,
};

const dangerBtn = {
  background: "#fee2e2",
  border: "1px solid #fecaca",
  color: "#991b1b",
  padding: "6px 10px",
  borderRadius: 8,
  marginTop: 8,
};

const actionBtn = {
  background: "#f3f4f6",
  border: "1px solid #d1d5db",
  color: "#374151",
  padding: "8px 16px",
  borderRadius: 6,
  cursor: "pointer",
};

const primaryBtn = {
  background: "#111",
  border: "1px solid #111",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: 6,
  cursor: "pointer",
};

const secondaryBtn = {
  background: "#fff",
  border: "1px solid #d1d5db",
  color: "#374151",
  padding: "10px 20px",
  borderRadius: 6,
  cursor: "pointer",
};

const previewBox = {
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  padding: 16,
  backgroundColor: "#fff",
  minHeight: "600px",
  maxHeight: "800px",
  overflow: "auto",
};

const previewText = {
  whiteSpace: "pre-wrap",
  fontFamily: "monospace",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: 0,
};
