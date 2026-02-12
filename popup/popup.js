import * as pdfjsLib from "../lib/pdf.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = "../lib/pdf.worker.mjs";

const resumeInput = document.getElementById("resume");
const jdInput = document.getElementById("jd");
const analyzeBtn = document.getElementById("analyze");
const resultDiv = document.getElementById("result");

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

analyzeBtn.addEventListener("click", async () => {
  const resumeFile = resumeInput.files[0];
  const jdText = jdInput.value;

  if (!resumeFile || !jdText) {
    resultDiv.innerText = "Please upload resume and paste job description.";
    return;
  }

  resultDiv.innerText = "Analyzing resume...";

  const resumeText = await extractTextFromPDF(resumeFile);

  const cleanResume = preprocessText(resumeText);
  const cleanJD = preprocessText(jdText);

  console.log("Resume:", cleanResume);
  console.log("JD:", cleanJD);

  resultDiv.innerText = "Resume & JD processed successfully ✅";
});
