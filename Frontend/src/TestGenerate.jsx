import { useState } from "react";
import { generateResume } from "./api";

export default function TestGenerate() {
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setOut("");
    try {
      const payload = {
        full_name: "Jane Doe",
        target_title: "Frontend Developer",
        email: "jane@example.com",
        phone: "+49 123 456",
        location: "Berlin, DE",
        links: "linkedin.com/in/jane, github.com/jane",
        summary: "2–3 lines about me.",
        experiences: [
          {
            role: "Frontend Dev",
            company: "ABC Retail",
            start: "2021-01",
            end: "Present",
            achievements: [
              "Increased conversion by 12% via performance work",
              "Built React testing with Jest/RTL",
            ],
          },
        ],
        education: [{ school: "CBW Hamburg", start: "2017", end: "2020" }],
        skills: "React, REST, Git",
      };

      const result = await generateResume(payload);
      setOut(result);
    } catch (e) {
      setOut(String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <button onClick={run} disabled={busy}>
        {busy ? "Generating…" : "Test generate-resume"}
      </button>
      {out && (
        <pre style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{out}</pre>
      )}
    </div>
  );
}
