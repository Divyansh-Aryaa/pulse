import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

url = "https://router.huggingface.co/v1"
print(f"Connecting to AI at: {url}")

# 🔹 Setup client safely
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


# 🔹 1. Commit Classification
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


# 🔹 2. Work Distribution
def get_work_distribution(commits):
    counts = {}
    for c in commits:
        t = c.get("type", "Other")
        counts[t] = counts.get(t, 0) + 1
    return counts


# 🔹 3. Bus Factor
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


# 🔹 4. Personas
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


# 🔹 5. Summary
def generate_summary_ai(commits):
    if not client:
        return ""

    messages = [c["message"] for c in commits[:15]]

    prompt = f"Summarize these commits into a short weekly engineering summary: {messages}"

    try:
        response = client.chat.completions.create(
            model=MODEL_ID,
            messages=[{"role": "user", "content": prompt}],
        )

        return response.choices[0].message.content

    except Exception as e:
        print(f"AI Error (summary): {e}")
        return ""


# 🔹 6. Impact Score
def calculate_impact(commits):
    score = 0
    for c in commits:
        score += len(c.get("message", ""))
    return score