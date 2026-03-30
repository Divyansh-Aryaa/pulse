
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
    calculate_impact,
    detect_uneven_contribution,
    calculate_health_score
)


def run_analysis(owner, repo):
    # Fetch raw data
    repo_info = get_repo_info(owner, repo)
    contributors = get_contributors(owner, repo)
    commits = get_commits(owner, repo)
    activity = get_commit_activity(owner, repo)
    languages = get_languages(owner, repo)

    # Insights
    insights = get_insights(contributors, activity)

    # AI Processing
    classified_commits = classify_commits_ai(commits)

    work_distribution = get_work_distribution(classified_commits)
    bus_factor = calculate_bus_factor(contributors)
    personas = generate_personas_ai(contributors)
    summary = generate_summary_ai(classified_commits)
    impact_score = calculate_impact(classified_commits)

    # Health Score and contributore balance
    contribution_balance = detect_uneven_contribution(contributors)
    health_score = calculate_health_score(contributors, classified_commits)

    # Final response
    return {
        **repo_info,
        "contributors": contributors,
        "commits": classified_commits,
        "commit_activity": activity,
        "languages": languages,
        "insights": insights,

        "ai": {
            "work_distribution": work_distribution,
            "bus_factor": bus_factor,
            "personas": personas,
            "summary": summary,
            "impact_score": impact_score,
            "health_score": health_score,
            "contribution_balance": contribution_balance
        }
    }
  