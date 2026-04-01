
# Pulse — Engineering Intelligence Dashboard
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Celery](https://img.shields.io/badge/Celery-5.3-37814A?style=for-the-badge&logo=celery&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![HuggingFace](https://img.shields.io/badge/HuggingFace-BART--MNLI-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)
![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

> **HBTU Campus Drive · Problem Statement: TOKYO · Ampcus Cyber**

Pulse is an AI-powered GitHub repository analyser that transforms raw commit data into actionable engineering intelligence. Give it any public GitHub repository URL and it returns a complete health report — contributor breakdown, commit classification, impact scores, bus factor risk, and an LLM-generated team summary — in under 30 seconds.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture Diagram](#architecture-diagram)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Team Roles](#team-roles)
- [Key Design Decisions (ADR)](#key-design-decisions-adr)
- [AI/ML Component Explained](#ml-component-explained)
- [Trade-offs and Limitations](#trade-offs-and-limitations)

---

## Project Overview

Most engineering teams have no visibility into the health of their own codebase — who is carrying the most risk, whether contributions are evenly spread, or what kind of work the team is actually doing day to day.

Pulse solves this by pulling commit history from GitHub, running it through an AI classification and scoring pipeline, and presenting the results as a visual dashboard.

**Input:** A GitHub repository URL
**Output:** A full engineering health report with:
- Contribution breakdown per developer
- Commit type classification (Feature / Bug Fix / Refactor / Docs / Test / Chore)
- Impact score per commit (1–10)
- Bus factor calculation
- Engineering health score (0–100)
- Gini coefficient for contribution inequality
- LLM-generated team narrative summary

---

**Example — analysing this repository:**
```
Input:  https://github.com/your-username/pulse
Output: Health Score 72/100 · Bus Factor 2 · 5 Contributors · 83 Commits
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User (Browser)                       │
│                    React + Vite Frontend                    │
│         RepoInput → Dashboard → Charts + Heatmap            │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP (axios)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Backend  :8000                    │
│   POST /api/analyze  →  GET /api/results/{job_id}           │
│   Routers → Services → Schemas (Pydantic validation)        │
└──────┬──────────────────────────────────┬───────────────────┘
       │ Enqueue job                       │ Read/Write
       ▼                                   ▼
┌─────────────┐                  ┌─────────────────────┐
│    Redis    │                  │    PostgreSQL       │
│  Job Queue  │                  │  repos, commits,    │
│  + Cache    │                  │  contributors, jobs │
└──────┬──────┘                  └─────────────────────┘
       │ Worker picks up job
       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Celery Worker (async)                     │
│                                                             │
│  GitHub API         AI/ML Engine          Scoring Engine    │
│  ─────────          ──────────            ──────────────    │
│  Fetch commits  →   AI writes the     →  Impact score       │
│  Fetch diffs        summary for now      Bus factor         │
│  Fetch contribs     ML classification    Health score       │
│                     soon                                    │
└─────────────────────────────────────────────────────────────┘
```

**Request lifecycle:**
1. User pastes repo URL → React calls `POST /api/analyze`
2. FastAPI creates a job record, pushes to Redis queue, returns `job_id` immediately
3. Celery worker picks up the job, fetches GitHub data, runs AI pipeline, saves to PostgreSQL
4. React polls `GET /api/results/{job_id}` every 2 seconds
5. When status = `completed`, dashboard renders all visualisations

---

## Tech Stack

| Layer | Technology | Why we chose it |
|---|---|---|
| Frontend | React 18 + Vite | Component model maps perfectly to dashboard cards; Vite gives instant hot reload |
| Charts | Recharts | Declarative chart API, works natively with React state |
| HTTP Client | Axios | Clean promise API, easy request interceptors for error handling |
| Backend | FastAPI (Python) | Native async support; auto-generates `/docs` API explorer; Pydantic validation |
| Task Queue | Celery | Industry-standard for Python background jobs; scales to multiple workers |
| Cache + Broker | Redis | Sub-millisecond reads; doubles as Celery message broker and result cache |
| Database | PostgreSQL | ACID compliance; complex JOIN queries for contributor aggregation |
| ORM | SQLAlchemy | Type-safe queries; Alembic migrations for schema version control |
| GitHub Data | PyGithub | Clean Python wrapper around GitHub REST API v3 |
| AI / LLM | HuggingFace API | Best-in-class commit classification and natural language summary generation |
| Containerisation | Docker + Docker Compose | One command starts all 5 services; eliminates "works on my machine" |

---

## Key Features

### Commit Classification(still working soon to be implemented)
Every commit is classified into one of seven categories using LLM model:
`Feature` · `Bug Fix` · `Refactor` · `Docs` · `Test` · `Chore` · `Security`

Batched in groups of 15 to minimise API calls. Falls back to keyword matching if the API is unavailable.

### Impact Scoring
Each commit receives a score from 1–10 based on:
- Lines of code changed (capped to prevent outlier inflation)
- Number of files affected
- Whether tests were included in the same commit
- Commit message quality (length and specificity)

### Bus Factor
Calculates the minimum number of developers whose departure would leave the majority of the codebase without a clear owner. Computed by mapping file ownership — the last person to touch each file. If one developer is the last-toucher on more than 40% of files, bus factor = 1.

### Engineering Health Score
A composite 0–100 score weighted across:
- Bus factor risk (30%)
- Contribution diversity — Gini coefficient (25%)
- Test commit ratio (20%)
- Commit frequency consistency (25%)

### LLM Team Summary
AI generates a 3–4 sentence natural language report naming specific contributors, flagging real risks, and recommending concrete improvements.

---

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 20+
- Docker Desktop (for PostgreSQL + Redis)
- GitHub Personal Access Token (repo read scope)
- Anthropic API Key

### Option A — Docker (recommended)

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/pulse.git
cd pulse

# Copy environment template and fill in your values
cp .env.example .env
# Open .env and add your GITHUB_TOKEN and ANTHROPIC_API_KEY

# Start all services — PostgreSQL, Redis, backend, worker, frontend
docker-compose up --build
```

App is running at `http://localhost:5173`
API docs at `http://localhost:8000/docs`

### Option B — Manual (4 terminals)

**Terminal 1 — Database and cache**
```bash
docker-compose up db redis
```

**Terminal 2 — FastAPI backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Terminal 3 — Celery worker**
```bash
cd backend
source venv/bin/activate
celery -A celery_worker.celery_app worker --loglevel=info
```

**Terminal 4 — React frontend**
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
GITHUB_TOKEN=ghp_your_token_here
HUGGINGFACE_API_KEY=sk-ant-your_key_here
DATABASE_URL=postgresql://postgres:password@localhost:5432/pulse_db
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=any_long_random_string
DEBUG=True
CACHE_TTL_SECONDS=86400
```

---

## API Documentation

Full interactive docs available at `http://localhost:8000/docs` when the server is running.

### `POST /api/analyze-repo`

This is initial stage repository analysis that uses job_store, a storage which is not persistence

**Request body:**
```json
{
  "repo_url": "https://github.com/owner/repository",
}
```
**Response:**
```json
{
  "status": "completed",
  "result": {
    "repo_name": "react",
    "owner": "facebook",
    "stars": 244275,
    "forks": 50867,
    "open_issues": 1188,
    "created_at": "2013-05-24T16:15:54Z",
    "updated_at": "2026-03-31T09:09:47Z",
    "language": "JavaScript",
    "contributors": [
      {
        "name": "sebmarkbage",
        "commits": 1939
      },
  ],
  "commits [
    { "message": "This commit is dealing...", 
      "author": "Jack Pope",
      "date": "2026-03-12T21:36:28Z",
      "sha": "c80a07509582daadf275f36ffe7a88c3b12e9db4",
      "additions": 111,
      "deletions": 3,
      "files_changed": 2
      },
  ],
  "commits_activity [
  {
        "week": 1743897600,
        "total_commits": 18
  },
]
  "languages": {
      "JavaScript": 5420882,
      "TypeScript": 2305749,
      "HTML": 116065,
      "CSS": 90513,
      "CoffeeScript": 18691,
      "Shell": 8899
    },
    "insights": [
      "Not an Active repository",
      "Good contributor distribution"
    ],
    "ai": {
      "work_distribution": {
        "Other": 20
      },
      "bus_factor": {
        "bus_factor": 30,
        "risk": "Healthy"
      },
      "personas": [],
      "summary": "",
      "impact_score": 3696,
      "health_score": 100,
      "contribution_balance": {
        "status": "Balanced",
        "risk": "Low"
      }
    }
  }
}
```

### `POST /api/analyze`

Queues a new repository analysis job with persistence storage 

**Request body:**
```json
{
  "repo_url": "https://github.com/owner/repository",
}
```

**Response:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued",
}
```

---

### `GET /api/results/{job_id}`

Returns analysis status and results when complete.

**Response (completed):**
```json
{
  "status": "completed",
  "result": {
    "repo_name": "react",
    "owner": "facebook",
    "stars": 244275,
    "forks": 50867,
    "open_issues": 1188,
    "created_at": "2013-05-24T16:15:54Z",
    "updated_at": "2026-03-31T09:09:47Z",
    "language": "JavaScript",
    "contributors": [
      {
        "name": "sebmarkbage",
        "commits": 1939
      },
  ],
  "commits [
    { "message": "This commit is dealing...", 
      "author": "Jack Pope",
      "date": "2026-03-12T21:36:28Z",
      "sha": "c80a07509582daadf275f36ffe7a88c3b12e9db4",
      "additions": 111,
      "deletions": 3,
      "files_changed": 2
      },
  ],
  "commits_activity [
  {
        "week": 1743897600,
        "total_commits": 18
  },
]
  "languages": {
      "JavaScript": 5420882,
      "TypeScript": 2305749,
      "HTML": 116065,
      "CSS": 90513,
      "CoffeeScript": 18691,
      "Shell": 8899
    },
    "insights": [
      "Not an Active repository",
      "Good contributor distribution"
    ],
    "ai": {
      "work_distribution": {
        "Other": 20
      },
      "bus_factor": {
        "bus_factor": 30,
        "risk": "Healthy"
      },
      "personas": [],
      "summary": "",
      "impact_score": 3696,
      "health_score": 100,
      "contribution_balance": {
        "status": "Balanced",
        "risk": "Low"
      }
    }
  }
}
```

**Response (still running):**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "running"
}
```

---

## Team Roles

| Member | Role | Branch | Responsibility |
|---|---|---|---|
| [Divyansh Shukla] | Backend Lead | `feature/local1`,`feature/local3`| FastAPI app, routers|GitHub API integration
| [Divyansh Arya] | Data Engineer | `feature/redis-integration`,`feature/celery-integration`,`feature/postgres-cache`| Redis caching, Celery task pipeline | PostgresSQL integration
| [Sumeet Kumar Surya] | AI/ML Engineer | `feature/update-ai-service` | HuggingFace API integration, commit reviews, commit merger, testing latest main code |
| [Sangh Priya Gautam] | Frontend Engineer | `feature/local2` | React dashboard, all charts, heatmap, contributor cards, API polling |
| [Divyansh Arya & Sumeet Kr. Surya] | DevOps + Docs | `feature/readme-update`,`feature/readme-update2`,`feature/env-setup` | GitHub Actions CI/CD, README, ADRs, test suite |

---

## Key Design Decisions (ADR)

### ADR-001 — FastAPI over Flask or Django

**Decision:** Use FastAPI as the backend framework.

**Reasoning:** GitHub API calls are slow (fetching 500 commits can take 20+ seconds). FastAPI's native `async/await` support lets us fire multiple API requests concurrently. Flask is synchronous by default and Django brings unnecessary ORM and admin overhead for an API-only backend.

**Trade-off:** FastAPI has a smaller ecosystem than Django and less community documentation, but for this project's scope the async advantage outweighs that.

---

### ADR-002 — Celery + Redis for async analysis

**Decision:** Run repository analysis as a background Celery task, not a synchronous HTTP request.

**Reasoning:** A large repo can have thousands of commits. Fetching and classifying them all synchronously would cause the HTTP request to time out (typically at 30 seconds). By queuing the job and polling for results, the frontend never hangs.

**Trade-off:** Adds operational complexity (need a running Redis instance and a separate worker process). Mitigated by Docker Compose wrapping all services.

---

### ADR-003 — PostgreSQL over SQLite or MongoDB

**Decision:** Use PostgreSQL as the persistent database.

**Reasoning:** The contributor aggregation queries (e.g. "give me all commits by person X grouped by type for the last 30 days, joined with their file ownership stats") are complex relational joins. MongoDB's document model would require denormalising data or doing joins in application code. SQLite has no concurrent write support, which breaks with Celery running parallel workers.

**Trade-off:** PostgreSQL requires a running server (added via Docker). Worth it for query correctness and performance.

---

## AI/ML Component Explained

HuggingFace LLM reasoning model summarizes the commits and over all repo

The evaluators specifically require teams to demonstrate understanding of their ML components, not just integration.

### What the model does(soon to be merged in main branch, still working on this)


### Input (example)
```
Classify each commit as one of: Feature, Bug Fix, Refactor, Docs, Test, Chore, Security

1. "add OAuth2 login with Google"
2. "fix null pointer in payment gateway"
3. "rename variables for readability in auth module"
```

### Output (example)
```json
["Feature", "Bug Fix", "Refactor"]
```

### Evaluation metrics (soon to be merged in main branch, still working on this)

We will evaluate classification accuracy against a manually labelled set of 50 commits:
- HuggingFace API: ~94% accuracy (expected)
- Keyword fallback: ~73% accuracy (expected)
- Biggest confusion: Chore vs Refactor (both involve code reorganisation)

### Failure cases we handle
- API timeout → keyword fallback activates automatically
- Malformed JSON response → retry once, then fallback
- Commit message is only 2–3 characters → classified as Chore by default
- Non-English commit messages → Claude handles these well; keyword fallback degrades gracefully

### Why this is meaningful ML, not decorative
Without classification, you cannot compute the commit type breakdown chart, you cannot calculate the test commit ratio (which feeds into the health score), and you cannot identify whether a contributor is primarily doing feature work or bug fixing. The classification output is load-bearing — removing it breaks three other features.

---

## Trade-offs and Limitations

| Limitation | Reason | Mitigation |
|---|---|---|
| Only analyses public repositories | GitHub API requires authentication for private repos | Acceptable for demo scope; documented clearly |
| Analysis limited to last 90 days | Full history of large repos would exceed API rate limits | Configurable via `days_back` parameter |
| Bus factor uses last-commit ownership | Does not account for code review or PR authorship | Noted in UI with tooltip explanation |
| HF API has cost per call | Batching 15 commits per request reduces cost by ~93% vs one call per commit | Batch size is configurable |
| No real-time updates via websocket | Frontend polls every 2 seconds instead | Acceptable for a 7-day build; WebSocket is in Nice to Have |

---

## Running Tests(soon to be merged in main branch, still working in this)

```bash
cd backend
source venv/bin/activate
pytest tests/ -v
```

```bash
# Run a specific test file
pytest tests/test_scoring_service.py -v

# Run with coverage report
pytest tests/ --cov=app --cov-report=term-missing
```

---

*Built for HBTU Campus Drive · Problem TOKYO · Ampcus Cyber · 2026*
