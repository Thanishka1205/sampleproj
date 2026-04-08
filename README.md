# Notes App

A full-stack **Notes App** built with **React** (Vite) frontend and **Flask** backend.

## Project Structure

```
notes-app/
├── backend/
│   ├── app.py            ← Flask REST API
│   ├── requirements.txt  ← Python dependencies
│   └── render.yaml       ← Render deployment config
└── frontend/
    ├── src/
    │   ├── App.jsx       ← Main React component
    │   ├── index.css     ← Full design system (dark theme)
    │   └── main.jsx      ← React entry point
    ├── index.html
    ├── package.json
    ├── vite.config.js    ← Vite config (proxies /notes → Flask)
    └── vercel.json       ← Vercel SPA routing config
```

---

## 🚀 Running Locally

### 1. Backend (Flask)

```bash
cd notes-app/backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Flask server
python app.py
```

Flask runs on: `http://127.0.0.1:5000`

### 2. Frontend (React + Vite)

Open a **new terminal**:

```bash
cd notes-app/frontend

# Install Node dependencies
npm install

# Start dev server
npm run dev
```

React dev server runs on: `http://localhost:3000`

> Vite automatically proxies `/notes` requests to Flask on port 5000. No CORS issues!

---

## 🌐 Deployment

### Backend → Render

1. Push the `backend/` folder to a GitHub repo
2. Go to [render.com](https://render.com) → New Web Service
3. Select your repo and set:
   - **Build command**: `pip install -r requirements.txt`
   - **Start command**: `gunicorn app:app`
4. Deploy → Get your URL e.g. `https://notes-api-xxx.onrender.com`

### Frontend → Vercel

1. Before deploying, update `API` in `src/App.jsx`:
   ```js
   const API = "https://notes-api-xxx.onrender.com";
   ```
2. Push `frontend/` to GitHub
3. Go to [vercel.com](https://vercel.com) → Import project
4. Vercel auto-detects Vite — click Deploy ✅

---

## 🔌 API Endpoints

| Method | Endpoint        | Description        |
|--------|-----------------|--------------------|
| GET    | `/notes`        | Get all notes      |
| POST   | `/notes`        | Add a new note     |
| DELETE | `/notes/<id>`   | Delete note by ID  |

---

## 💡 Upgrade Ideas

- 🤖 **AI Summarization** — Hugging Face / OpenAI
- 🗄️ **MongoDB** — Persist notes across restarts
- 🔍 **Search & Tags** — Filter and organize
- 🔐 **Auth** — User login with JWT

---

## Requirements

- Python 3.8+
- Node.js 18+ (for frontend)
