import * as pdfjsLib from "../lib/pdf.mjs";

// PDF.js worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc = "../lib/pdf.worker.mjs";

// ---------------- DOM ELEMENTS ----------------
const resumeInput = document.getElementById("resume");
const jdInput = document.getElementById("jd");
const analyzeBtn = document.getElementById("analyze");
const resultDiv = document.getElementById("result");
const apiKeyInput = document.getElementById("apiKey");

// ---------------- API KEY STORAGE ----------------
chrome.storage.local.get(["apiKey"], res => {
  if (res.apiKey) apiKeyInput.value = res.apiKey;
});

apiKeyInput.addEventListener("change", () => {
  chrome.storage.local.set({ apiKey: apiKeyInput.value });
});

// ---------------- PDF EXTRACTION ----------------
async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(i => i.str).join(" ") + " ";
  }
  return text;
}

// ---------------- TEXT PREPROCESSING ----------------
function preprocessText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ---------------- KEYWORDS ----------------
function extractKeywords(text) {
  const stopwords = new Set([
    "and","or","the","is","are","to","with","for","of","in","on","a","an","as"
  ]);

  return [...new Set(
    text.split(" ").filter(w => w.length > 2 && !stopwords.has(w))
  )];
}

// ---------------- SKILLS ----------------
const SKILLS = new Set([
  "javascript","typescript","react","angular","vue",
  "node","express","python","java",
  "sql","mongodb","postgresql",
  "docker","kubernetes","aws",
  "rest","api","git","github"
]);

// ---------------- ATS SCORING ----------------
function calculateATSScore(resumeText, jdText) {
  const jdKeywords = extractKeywords(jdText);
  const resumeWords = new Set(resumeText.split(" "));

  let score = 0;
  let maxScore = 0;
  const matched = [];
  const missing = [];

  jdKeywords.forEach(word => {
    let weight = 1;
    if (SKILLS.has(word)) weight = 3;
    else if (word.length > 6) weight = 2;

    maxScore += weight;

    if (resumeWords.has(word)) {
      score += weight;
      matched.push(word);
    } else {
      missing.push(word);
    }
  });

  return {
    score: Math.round((score / maxScore) * 100),
    matched,
    missing
  };
}

// ---------------- UI HELPERS ----------------
function scoreClass(score) {
  if (score >= 75) return "good";
  if (score >= 50) return "medium";
  return "bad";
}

function animateScore(el, target) {
  let current = 0;
  const step = Math.max(1, Math.floor(target / 30));

  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    el.textContent = `ATS Match: ${current}%`;
  }, 20);
}

// ---------------- AI ENHANCEMENT ----------------
async function enhanceWithAI(resumeText, jdText, apiKey) {
  const prompt = `
You are an ATS resume expert.

Job Description:
${jdText}

Resume:
${resumeText}

Tasks:
1. List missing skills
2. Rewrite 2 resume bullets to better match the JD
3. Give concise improvement tips
`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4
    })
  });

  const data = await res.json();
  return data.choices[0].message.content;
}

// ---------------- MAIN HANDLER ----------------
analyzeBtn.addEventListener("click", async () => {
  const resumeFile = resumeInput.files[0];
  const jdText = jdInput.value;

  if (!resumeFile || !jdText) {
    resultDiv.innerText = "Please upload resume and paste job description.";
    return;
  }

  // Loading skeleton
  resultDiv.innerHTML = `
    <div class="loading"></div>
    <div class="loading" style="width:80%"></div>
    <div class="loading" style="width:60%"></div>
  `;

  const resumeText = await extractTextFromPDF(resumeFile);
  const cleanResume = preprocessText(resumeText);
  const cleanJD = preprocessText(jdText);

  const { score, matched, missing } =
    calculateATSScore(cleanResume, cleanJD);

  const cls = scoreClass(score);

  const matchedBadges = matched.slice(0, 12)
    .map(w => `<span class="badge">${w}</span>`).join("");

  const missingBadges = missing.slice(0, 12)
    .map(w => `<span class="badge missing">${w}</span>`).join("");

  resultDiv.innerHTML = `
    <div id="score" class="score ${cls}">ATS Match: 0%</div>

    <div class="section">
      <strong>Matched Skills</strong><br/>
      ${matchedBadges || "<em>None</em>"}
    </div>

    <div class="section">
      <strong>Missing Skills</strong><br/>
      ${missingBadges || "<em>None</em>"}
    </div>

    <button id="aiBtn" class="secondary">Enhance with AI (Optional)</button>
  `;

  animateScore(document.getElementById("score"), score);

  // AI BUTTON
  document.getElementById("aiBtn").addEventListener("click", async () => {
    const apiKey = apiKeyInput.value;
    if (!apiKey) {
      alert("Please enter your API key to use AI features.");
      return;
    }

    resultDiv.innerHTML += `<p><em>Enhancing with AI...</em></p>`;

    try {
      const aiText = await enhanceWithAI(cleanResume, cleanJD, apiKey);
      resultDiv.innerHTML += `
        <div class="section">
          <strong>AI Suggestions</strong>
          <pre style="white-space:pre-wrap">${aiText}</pre>
        </div>
      `;
    } catch {
      alert("AI request failed. Check API key or network.");
    }
  });
});
