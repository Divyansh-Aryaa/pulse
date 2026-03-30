import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

url = "https://router.huggingface.co/v1"
print(f"Connecting to AI at: {url}")

# Setup client safely
api_key = os.getenv("HF_TOKEN")

client = None
if api_key:
    client = OpenAI(
        base_url="https://router.huggingface.co/v1",
        api_key=api_key
    )
else:
    print("⚠️ HF_TOKEN not set, AI features disabled")

MODEL_ID = "moonshotai/Kimi-K2-Instruct-0905"


def safe_json_parse(content):
    try:
        clean_content = content.replace("json", "").replace("", "").strip()
        return json.loads(clean_content)
    except Exception as e:
        print(f"JSON Parsing Error: {e}")
        return None


# Commit Classification
def classify_commits_ai(commits):
    if not client:
        return commits

    messages = [c["message"] for c in commits[:10]]

    prompt = f"""
    You are an Engineering Manager.
    Classify the following commit messages into: Feature, Bug, Refactor, Documentation, Other.
    Return ONLY JSON like: [{{ "message": "...", "type": "Feature" }}]
    Commits: {messages}
    """

    try:
        response = client.chat.completions.create(
            model=MODEL_ID,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )

        result = safe_json_parse(response.choices[0].message.content) or []

        for i, c in enumerate(result):
            if i < len(commits):
                commits[i]["type"] = c.get("type", "Other")

        return commits

    except Exception as e:
        print(f"AI Error (classify): {e}")
        return commits


# Work Distribution
def get_work_distribution(commits):
    counts = {}
    for c in commits:
        t = c.get("type", "Other")
        counts[t] = counts.get(t, 0) + 1
    return counts


# Bus Factor
def calculate_bus_factor(contributors):
    if not contributors:
        return {"bus_factor": 0, "risk": "Unknown"}

    top = contributors[0].get("percentage", 0)

    if top > 70:
        return {"bus_factor": 1, "risk": "High Risk"}
    elif top > 40:
        return {"bus_factor": 2, "risk": "Moderate Risk"}
    else:
        return {"bus_factor": len(contributors), "risk": "Healthy"}


# Personas
def generate_personas_ai(contributors):
    if not client:
        return []

    names = [c["name"] for c in contributors]

    prompt = f"""
    You are an Engineering Manager. Assign a persona: Bug Fixer, Feature Builder, Maintainer, Documentation Expert.
    Return ONLY JSON: [{{ "name": "User1", "persona": "Bug Fixer" }}]
    Contributors: {names}
    """

    try:
        response = client.chat.completions.create(
            model=MODEL_ID,
            messages=[{"role": "user", "content": prompt}],
        )

        return safe_json_parse(response.choices[0].message.content) or []

    except Exception as e:
        print(f"AI Error (personas): {e}")
        return []


# Summary
def generate_summary_ai(commits):
    if not client:
        return ""

    messages = [c["message"] for c in commits[:15]]

    prompt = f"""
    You are a senior Engineering manager. 
    Write a short weekly report summarizing: 
    - Key feature added 
    - Bug fixed
    - Overall engineering activity
    
    Commits: {messages}"""

    try:
        response = client.chat.completions.create(
            model=MODEL_ID,
            messages=[{"role": "user", "content": prompt}],
        )

        return response.choices[0].message.content

    except Exception as e:
        print(f"AI Error (summary): {e}")
        return ""


# Impact Score
def calculate_impact(commits):
    total = 0
    for c in commits:
        additions = c.get("additions", 0)
        deletions = c.get("deletions", 0)
        files = c.get("files_changed")

        total += additions + deletions + (files * 5)
    return total

# Uneven contribution check

def detect_uneven_contribution(contributors):
    if not contributors:
        return{"status": "No Data"}
    
    top = contributors[0].get("percentage", 0)

    if top > 70:
        return {"status": "Highly Uneven", "risk": "High"}
    elif top > 50:
        return {"status": "Moderately Uneven", "risk": "Medium"}
    else:
        return {"status": "Balanced", "risk": "Low"}
    

 # AI Engineering Health Score

def calculate_health_score(contributors, commits):
    score = 100

    # Bus Factor impact
    bus = calculate_bus_factor(contributors)["bus_factor"]
    if bus == 1:
        score -= 40
    elif bus == 2:
        score -= 20

    # Uneven Contribution    
    uneven = detect_uneven_contribution(contributors)
    if uneven["risk"] == "High":
        score -= 30
    elif uneven["risk"] == "Medium":
        score -= 15

    # Activity level 
    if len(commits) < 10:
        score -= 10

    return max(score, 0)
               

