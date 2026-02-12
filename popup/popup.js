import * as pdfjsLib from "../lib/pdf.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = "../lib/pdf.worker.mjs";

const resumeInput = document.getElementById("resume");
const jdInput = document.getElementById("jd");
const analyzeBtn = document.getElementById("analyze");
const resultDiv = document.getElementById("result");
const SKILLS = new Set([
  "javascript","typescript","react","angular","vue",
  "node","express","python","java",
  "sql","mongodb","postgresql",
  "docker","kubernetes","aws",
  "rest","api","git","github"
]);

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(" ");
    text += pageText + " ";
  }

  return text;
}

function preprocessText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
function extractKeywords(text) {
  const stopwords = new Set([
    "and","or","the","is","are","to","with","for","of","in","on","a","an","as"
  ]);

  return [...new Set(
    text
      .split(" ")
      .filter(word => word.length > 2 && !stopwords.has(word))
  )];
}
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


analyzeBtn.addEventListener("click", async () => {
  const resumeFile = resumeInput.files[0];
  const jdText = jdInput.value;

  if (!resumeFile || !jdText) {
    resultDiv.innerText = "Please upload resume and paste job description.";
    return;
  }

  resultDiv.innerText = "Analyzing resume...";

  // 1️⃣ Extract & preprocess resume
  const resumeText = await extractTextFromPDF(resumeFile);
  const cleanResume = preprocessText(resumeText);

  // 2️⃣ Preprocess JD
  const cleanJD = preprocessText(jdText);

  // 3️⃣ ATS score calculation (THIS IS WHERE YOUR CODE GOES)
  const { score, matched, missing } =
    calculateATSScore(cleanResume, cleanJD);

  // 4️⃣ Display result
  resultDiv.innerHTML = `
    <strong>ATS Match Score:</strong> ${score}%<br/><br/>
    <strong>Matched Keywords:</strong> ${matched.slice(0, 10).join(", ")}<br/><br/>
    <strong>Missing Keywords:</strong> ${missing.slice(0, 10).join(", ")}
  `;
});

