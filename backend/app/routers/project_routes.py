from fastapi import APIRouter
from app.models.repo_model import RepoRequest
from app.utils.parser import get_owner_repo

from app.services.repo_service import get_repo_info
from app.services.contributor_service import get_contributors
from app.services.commit_service import get_commits
from app.services.activity_service import get_commit_activity
from app.services.language_service import get_languages
from app.services.insight_service import get_insights

from app.services.ai_service import (
    classify_commits_ai,
    get_work_distribution,
    calculate_bus_factor,
    generate_personas_ai,
    generate_summary_ai,
    calculate_impact
)

router = APIRouter()

@router.post("/analyze-repo")
def analyze_repo(data: RepoRequest):
    owner, repo = get_owner_repo(data.repo_url)

    repo_info = get_repo_info(owner, repo)
    contributors = get_contributors(owner, repo)
    commits = get_commits(owner, repo)
    activity = get_commit_activity(owner, repo)
    languages = get_languages(owner, repo)
    insights = get_insights(contributors, activity)


    classified_commits = classify_commits_ai(commits)  # 🔥 AI classification
    work_distribution = get_work_distribution(classified_commits)
    bus_factor = calculate_bus_factor(contributors)
    personas = generate_personas_ai(contributors)
    summary = generate_summary_ai(commits)
    impact_score = calculate_impact(commits)


    return {
        **repo_info,
        "contributors": contributors,
        "commits": commits,
        "commit_activity": activity,
        "languages": languages,
        "insights": insights,

        "ai": {
            "work_distribution": work_distribution,
            "bus_factor": bus_factor,
            "personas": personas,
            "summary": summary,
            "impact_score": impact_score
        }

    }