const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8010";

export async function checkHealth() {
  const r = await fetch(`${API_BASE}/api/health`);
  if (!r.ok) throw new Error("health failed");
  const j = await r.json();
  return j.status || "ok";
}

export async function generateResume(payload) {
  const r = await fetch(`${API_BASE}/api/generate-resume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await r.text(); // backend may return plain text
  if (!r.ok) throw new Error(text || "generate failed");
  // try to parse json, otherwise return text
  try {
    const j = JSON.parse(text);
    return j.resume || j.result || j.text || text;
  } catch {
    return text;
  }
}

export async function generateCoverLetter(payload) {
  const r = await fetch(`${API_BASE}/api/cover-letter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await r.text(); // backend may return plain text
  if (!r.ok) throw new Error(text || "generate failed");
  // try to parse json, otherwise return text
  try {
    const j = JSON.parse(text);
    return j.letter || j.result || j.text || text;
  } catch {
    return text;
  }
}

export async function improveResume(payload) {
  const r = await fetch(`${API_BASE}/api/improve-resume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await r.text(); // backend may return plain text
  if (!r.ok) throw new Error(text || "improve failed");
  // try to parse json, otherwise return text
  try {
    const j = JSON.parse(text);
    return j.improved || j.result || j.text || text;
  } catch {
    return text;
  }
}

export async function scoreResume(payload) {
  const r = await fetch(`${API_BASE}/api/score-resume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error("score failed");
  return await r.json();
}
