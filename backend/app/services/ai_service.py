# codes here
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

url = "https://router.huggingface.co/v1"
print(f"Connecting to AI at: {url}")

# 🔹 1. Setup the Kimi-K2 Client via Hugging Face Router
# This allows us to use the OpenAI SDK with Hugging Face models
client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=os.getenv("HF_TOKEN")
)

# 🔹 IMPORTANT: You must use this MODEL_ID in your function calls
MODEL_ID = "moonshotai/Kimi-K2-Instruct-0905"

def safe_json_parse(content):
    """Helper to strip markdown and parse JSON safely."""
    try:
        # Remove markdown formatting if present
        clean_content = content.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_content)
    except Exception as e:
        print(f"JSON Parsing Error: {e}")
        return None

# 🔹 1. Commit Classification using AI
def classify_commits_ai(commits):
    messages = [c["message"] for c in commits[:10]]

    prompt = f"""
    You are an Engineering Manager.
    Classify the following commit messages into: Feature, Bug, Refactor, Documentation, Other.
    Return ONLY JSON like: [{{ "message": "...", "type": "Feature" }}]
    Commits: {messages}
    """

    # UPDATE: Changed model to MODEL_ID (Hugging Face)
    response = client.chat.completions.create(
        model=MODEL_ID,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )

    result = safe_json_parse(response.choices[0].message.content) or []

    # Merge types back into commits
    for i, c in enumerate(result):
        if i < len(commits):
            commits[i]["type"] = c.get("type", "Other")

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

# 🔹 4. Contributor Personas using AI
def generate_personas_ai(contributors):
    names = [c["name"] for c in contributors]

    prompt = f"""
    You are an Engineering Manager. Assign a persona: Bug Fixer, Feature Builder, Maintainer, Documentation Expert.
    Return ONLY JSON: [{{ "name": "User1", "persona": "Bug Fixer" }}]
    Contributors: {names}
    """

    # UPDATE: Changed model to MODEL_ID
    response = client.chat.completions.create(
        model=MODEL_ID,
        messages=[{"role": "user", "content": prompt}],
    )

    return safe_json_parse(response.choices[0].message.content) or []

# 🔹 5. Weekly Summary using AI
def generate_summary_ai(commits):
    messages = [c["message"] for c in commits[:15]]

    prompt = f"Summarize these commits into a short weekly engineering summary: {messages}"

    # UPDATE: Changed model to MODEL_ID
    response = client.chat.completions.create(
        model=MODEL_ID,
        messages=[{"role": "user", "content": prompt}],
    )

    return response.choices[0].message.content

# 🔹 6. Impact Score
def calculate_impact(commits):
    score = 0
    for c in commits:
        score += len(c.get("message", ""))
    return score