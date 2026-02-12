📄 Resume ATS Analyzer (Chrome Extension)

A hybrid, AI-ready Chrome extension that analyzes resumes against job descriptions using ATS-style scoring, skill prioritization, and optional AI-powered resume enhancement.

🚀 Overview

Resume ATS Analyzer helps job seekers understand how well their resume matches a job description by simulating how Applicant Tracking Systems (ATS) work.

Unlike simple keyword checkers, this extension:
Uses weighted scoring
Prioritizes technical skills
Works fully offline
Adds AI enhancements only when the user opts in

✨ Features

✅ Upload resume in PDF format
✅ Paste job description
✅ ATS-style match score (%)
✅ Skill-based weighted scoring logic
✅ Highlights matched vs missing skills
✅ Clean, modern UI with animations
✅ Optional AI enhancement (user-provided API key)
✅ No backend server required
✅ Privacy-friendly (everything runs locally)

📸 Screenshots

(Add your screenshots here)

ATS Analysis View

AI Enhancement Output

🧠 How It Works (Architecture)
1️⃣ Resume Parsing
Uses PDF.js to extract text client-side
No files are uploaded anywhere
2️⃣ Text Preprocessing
Lowercasing
Noise removal
Keyword normalization

3️⃣ ATS Scoring Logic

Job description keywords extracted
Resume content matched against them
Weighted scoring system:
Core skills → higher weight
Long technical terms → medium weight
Generic keywords → lower weight

4️⃣ Optional AI Layer

Runs only when user clicks
Uses user-provided API key
Suggests missing skills
Rewrites resume bullet points
Provides improvement tips

🔐 API keys are stored locally using chrome.storage and are never auto-used.

🧮 ATS Scoring Strategy
Keyword Type	Weight
Core technical skills	High
Tools / Technologies	Medium
Generic keywords	Low

Final ATS Match Score =
(Matched Keyword Weight / Total Keyword Weight) × 100

🛠 Tech Stack

JavaScript (ES Modules)
Chrome Extensions API (Manifest v3)
PDF.js
HTML / CSS
OpenAI-compatible API (optional)

Chrome Storage API

🔒 Privacy & Security

✅ No resume data is sent to any server
✅ Works completely offline by default
✅ AI is optional and user-triggered
✅ API keys are never hardcoded
✅ No analytics or tracking

⚙️ How to Run Locally

Clone this repository

git clone https://github.com/your-username/resume-ats-analyzer.git


Open Chrome and go to:

chrome://extensions

Enable Developer Mode
Click Load unpacked
Select the project folder
Pin the extension to the toolbar

🎯 Use Cases

Job seekers optimizing resumes
Students applying for internships
Developers understanding ATS systems
Resume tailoring before applications

📌 Why This Project Is Different

Not just keyword matching
Realistic ATS simulation
Hybrid AI design (cost-safe)
Strong focus on UX & privacy
Resume-worthy engineering project

📄 License

MIT License — free to use, modify, and share.

🙌 Author

Roshal Dsouza
Computer Science | Full Stack | AI Projects
🔗 LinkedIn: https://www.linkedin.com/in/roshal-dsouza-571910228/
💻 GitHub: https://www.github.com/roshaldsouza

⭐ If You Like This Project

Give it a ⭐ on GitHub — it helps a lot!
