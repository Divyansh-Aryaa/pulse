# 🚀 Pulse — Engineering Intelligence Dashboard

> Analyze any GitHub repository and generate deep insights into contributions, code activity, and engineering health.

---

## 📌 Problem Statement

Pulse is designed to analyze a GitHub repository and provide meaningful insights into:

- Contribution breakdown
- Commit activity and summaries
- Contributor profiles
- Engineering patterns and team health

This system can also be used to analyze our own team performance.

📄 Reference: Problem Statement :contentReference[oaicite:0]{index=0}

---

## 🧠 Core Features

- 🔗 Input: GitHub Repository URL
- 📊 Contribution analysis per developer
- 🧾 Commit classification (Feature, Bug Fix, etc.)
- 👤 Contributor insights
- 📈 Engineering health score
- ⚠️ Detection of uneven contributions
- 🤖 AI-generated repository summaries

---

## 🏗️ Tech Stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- Celery (Async Tasks)
- Redis (Caching)

### Frontend
- React (Vite)
- Axios
- Recharts (Charts)

### DevOps
- Docker & Docker Compose
- GitHub Actions (CI/CD)

---

## 📁 Project Structure
```bash
pulse/
├── backend/ # FastAPI backend
├── frontend/ # React frontend
├── .github/ # CI/CD workflows
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 👥 Team & Responsibilities

| Member | Role | Branch |
|-------|------|-------|
| Member 1 | Backend API | feature/backend-api |
| Member 2 | GitHub Service | feature/github-service |
| Member 3 | AI Engine | feature/ai-engine |
| Member 4 | Frontend | feature/react-dashboard |
| Member 5 | DevOps & Docs | feature/docs-docker |

---

## ⚙️ Setup Instructions (Initial)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/pulse.git
cd pulse
```
