def get_insights(contributors, commit_activity):
    insights = []

    
    # 1. Low Activity Check
   
    if commit_activity:
        last_weeks = commit_activity[-50:]  # last 4 weeks
        total = sum([w["total_commits"] for w in last_weeks])

        if total > 0:
            insights.append("Active repository")
        else:
            insights.append("Not an Active repository")
    else:
        insights.append("No activity data available")

   
    # 2. Bus Factor Check
    
    if contributors:
        total_commits = sum([c["commits"] for c in contributors])

        top = contributors[0]["commits"] if contributors else 0

        if total_commits > 0:
            ratio = top / total_commits

            if ratio > 0.7:
                insights.append("High contributor dependency (low bus factor)")
            else:
                insights.append("Good contributor distribution")

    return insights