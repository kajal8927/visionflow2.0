import os
import json
import requests


OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def _fallback_roadmap() -> list[str]:
    return [
        "Clearly define the problem, target users, and expected impact",
        "Research existing solutions, competitors, and market gaps",
        "Finalize MVP features and technical requirements",
        "Design UI/UX wireframes and user journey",
        "Develop backend APIs, database models, and frontend screens",
        "Test the solution with real users and collect feedback",
        "Improve the product and prepare deployment strategy",
    ]


def _extract_json_array(text: str) -> list[str]:
    cleaned = (text or "").replace("```json", "").replace("```", "").strip()

    start = cleaned.find("[")
    end = cleaned.rfind("]")

    if start == -1 or end == -1:
        raise ValueError("AI response does not contain JSON array")

    data = json.loads(cleaned[start : end + 1])

    if not isinstance(data, list):
        raise ValueError("AI response is not a list")

    return [str(item).strip() for item in data if str(item).strip()]


def generate_roadmap(text: str) -> list[str]:
    api_key = os.getenv("OPENROUTER_API_KEY")
    model = os.getenv("OPENROUTER_MODEL", "openrouter/free")

    if not api_key:
        print("AI roadmap skipped: OPENROUTER_API_KEY missing")
        return _fallback_roadmap()

    prompt = f"""
You are a startup product planning expert.

Generate a practical implementation roadmap for this idea:

{text}

Rules:
- Return ONLY a valid JSON array of strings.
- Give 7 to 9 steps.
- Each step must be specific to this idea.
- Avoid generic roadmap lines.
- Keep each step short and clear.
- Do not include markdown or extra explanation.
"""

    try:
        response = requests.post(
            OPENROUTER_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": os.getenv("CLIENT_URL", "http://localhost:5175"),
                "X-Title": "VisionFlow",
            },
            json={
                "model": model,
                "messages": [
                    {
                        "role": "system",
                        "content": "You return only valid JSON arrays.",
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                "temperature": 0.35,
                "max_tokens": 900,
            },
            timeout=25,
        )

        response.raise_for_status()

        content = response.json()["choices"][0]["message"]["content"]
        roadmap = _extract_json_array(content)

        return roadmap if roadmap else _fallback_roadmap()

    except Exception as error:
        print("AI roadmap error:", str(error))
        return _fallback_roadmap()