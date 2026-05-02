# Prompt Enhancer

> Transform vague ideas into precision prompts — instantly.

![Banner](https://img.shields.io/badge/Powered%20by-Gemini%20AI-blue?style=for-the-badge&logo=google)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## Live Demo

> 🔗 **Live View:** [Click Here!](https://prompt-enhancer-frontend.onrender.com)

---

## Features

-  **AI-Powered Enhancement** — Google Gemini 2.0 Flash transforms raw prompts into optimized ones
-  **Use Case Selector** — Coding, Writing, Image Generation, Data Analysis, Research, General
-  **Tone Control** — Professional, Creative, Technical, Simple
-  **Before / After View** — Original and enhanced prompt side by side
-  **One-Click Copy** — Copy enhanced prompt instantly
-  **History** — Last 5 prompts saved in session
-  **Keyboard Shortcut** — `Ctrl + Enter` to enhance
-  **Dark UI** — Modern dark theme with smooth animations

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite |
| Styling | Pure CSS |
| Backend | Python + FastAPI |
| AI Model | Google Gemini 2.0 Flash |
| Deployment | Render |

---

## 📁 Project Structure
```

prompt-enhancer/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
├── .gitignore
└── README.md

```





---

## Local Setup

### Prerequisites
- Python 3.8+
- Node.js 18+
- Gemini API Key → [Get here](https://aistudio.google.com/welcome?utm_source=google&utm_medium=cpc&utm_campaign=Cloud-SS-DR-AIS-FY26-global-gsem-1713578&utm_content=text-ad&utm_term=KW_gemini%20api%20key&gad_source=1&gad_campaignid=23417416052&gbraid=0AAAAACn9t64ZFv2f1B_ms4P8fjpjjWmMj&gclid=CjwKCAjwwdbPBhBgEiwAxBRA4bfIn6Dt_zIWH6bwxEdGsLUXJvQHLAStOsjqV_63Md2_TSBf7geK5RoCIoEQAvD_BwE)

### 1. Clone

```bash
git clone https://github.com/Sumit-Kushwaha62/prompt-enhancer.git
cd prompt-enhancer
```

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
```

Create `.env` in `backend/`:

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```
