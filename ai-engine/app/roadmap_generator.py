import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def _fallback_roadmap(text: str = "") -> list[str]:
    idea = text[:80] if text else "this idea"

    return [
        f"Identify the main problem solved by {idea}",
        f"Define target users and core features for {idea}",
        "Research competitors and market opportunities",
        "Prepare MVP features and technical requirements",
        "Design frontend UI, backend APIs, and database schema",
        "Develop and integrate AI-powered functionalities",
        "Perform testing, debugging, and optimization",
        "Deploy the application and collect user feedback",
    ]


def _extract_json_array(text: str) -> list[str]:
    cleaned = (
        (text or "")
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    start = cleaned.find("[")
    end = cleaned.rfind("]")

    if start == -1 or end == -1:
        raise ValueError("No JSON array found in AI response")

    data = json.loads(cleaned[start : end + 1])

    if not isinstance(data, list):
        raise ValueError("AI response is not a JSON list")

    return [str(item).strip() for item in data if str(item).strip()]


def generate_roadmap(text: str) -> list[str]:
    api_key = os.getenv("OPENROUTER_API_KEY")
    model = os.getenv("OPENROUTER_MODEL", "openrouter/free")

    if not api_key:
        print("OPENROUTER_API_KEY missing")
        return _fallback_roadmap(text)

    prompt = f"""
You are an expert startup roadmap planner.

Generate a practical implementation roadmap for this startup idea:

{text}

Requirements:
- Return ONLY a valid JSON array
- Include 7 to 9 roadmap steps
- Each step should be practical and specific to the idea
- Keep steps short and clear
- No markdown
- No explanation
"""

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": os.getenv("CLIENT_URL", "http://localhost:5175"),
        "X-Title": "VisionFlow",
    }

    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": "Return ONLY a pure JSON array. No markdown. No explanation.",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        "temperature": 0.6,
        "max_tokens": 800,
    }

    try:
        response = requests.post(
            OPENROUTER_URL,
            headers=headers,
            json=payload,
            timeout=30,
        )

        print("OpenRouter status:", response.status_code)

        if response.status_code >= 400:
            print("OpenRouter error:", response.text)

        response.raise_for_status()

        result = response.json()

        content = (
            result.get("choices", [{}])[0]
            .get("message", {})
            .get("content", "")
        )

        print("AI CONTENT:", content)

        roadmap = _extract_json_array(content)

        if roadmap:
            return roadmap

        return _fallback_roadmap(text)

    except Exception as error:
        print("AI roadmap error:", str(error))
        return _fallback_roadmap(text)