def analyze_idea(text: str) -> dict:
    """
    Analyze idea text and return feasibility score, risk level, AI feedback,
    and selection reason.
    """

    text = text or ""
    text_lower = text.lower()
    words = text_lower.split()
    word_count = len(words)

    detail_score = min(35, word_count * 1.2)

    problem_keywords = [
        "problem", "challenge", "issue", "struggle", "lack", "waste",
        "inefficient", "difficulty", "need", "pain point"
    ]
    problem_score = sum(1 for kw in problem_keywords if kw in text_lower) * 4
    problem_score = min(20, problem_score)

    solution_keywords = [
        "solution", "platform", "system", "app", "dashboard", "ai",
        "automation", "monitor", "recommend", "analyze", "detect", "track"
    ]
    solution_score = sum(1 for kw in solution_keywords if kw in text_lower) * 4
    solution_score = min(25, solution_score)

    impact_keywords = [
        "user", "farmers", "students", "patients", "business",
        "market", "revenue", "cost", "efficiency", "productivity",
        "savings", "scalable", "impact"
    ]
    impact_score = sum(1 for kw in impact_keywords if kw in text_lower) * 3
    impact_score = min(20, impact_score)

    feasibility_score = int(
        min(100, detail_score + problem_score + solution_score + impact_score)
    )

    high_risk_keywords = [
        "drone", "surveillance", "stock trading", "criminal prediction",
        "self-driving", "autonomous vehicle", "medical diagnosis",
        "financial transaction", "police", "weapon"
    ]

    if any(keyword in text_lower for keyword in high_risk_keywords):
        risk_level = "High"
    elif feasibility_score >= 75:
        risk_level = "Low"
    elif feasibility_score >= 50:
        risk_level = "Medium"
    else:
        risk_level = "High"

    ai_feedback = generate_ai_feedback(
        text=text,
        score=feasibility_score,
        risk=risk_level,
    )

    selection_reason = generate_selection_reason(
        text=text,
        score=feasibility_score,
        risk=risk_level,
    )

    return {
        "feasibilityScore": feasibility_score,
        "riskLevel": risk_level,
        "aiFeedback": ai_feedback,
        "selectionReason": selection_reason,
    }


def generate_ai_feedback(text: str, score: int, risk: str) -> str:
    text_lower = (text or "").lower()

    if "waste" in text_lower or "garbage" in text_lower:
        return (
            f"This waste management idea is practical and impactful. It should focus on IoT sensor reliability, "
            f"optimized collection routes, municipal partnerships, and cost-effective deployment. "
            f"Current feasibility is {score}/100 with {risk.lower()} risk."
        )

    if "disaster" in text_lower or "flood" in text_lower or "earthquake" in text_lower:
        return (
            f"This disaster management idea has strong public safety value. It needs reliable real-time data, "
            f"accurate prediction models, emergency alert validation, and government collaboration. "
            f"Current feasibility is {score}/100 with {risk.lower()} risk."
        )

    if "drone" in text_lower or "surveillance" in text_lower:
        return (
            f"This drone or surveillance idea is technically advanced but risky. It requires privacy compliance, "
            f"safety controls, secure communication, hardware planning, and real-time video processing. "
            f"Current feasibility is {score}/100 with {risk.lower()} risk."
        )

    if "stock" in text_lower or "trading" in text_lower:
        return (
            f"This finance idea has commercial potential but high uncertainty. It requires strong risk management, "
            f"secure trading APIs, regulatory compliance, and clear user protection. "
            f"Current feasibility is {score}/100 with {risk.lower()} risk."
        )

    if "resume" in text_lower or "job" in text_lower or "career" in text_lower:
        return (
            f"This career-focused idea is useful for students and job seekers. It should focus on ATS scoring, "
            f"job-description matching, keyword suggestions, and downloadable improvement reports. "
            f"Current feasibility is {score}/100 with {risk.lower()} risk."
        )

    if "study" in text_lower or "student" in text_lower or "education" in text_lower:
        return (
            f"This education idea has clear student value. It should focus on personalized study plans, "
            f"weak-subject detection, progress tracking, and exam-based scheduling. "
            f"Current feasibility is {score}/100 with {risk.lower()} risk."
        )

    if "farming" in text_lower or "farmer" in text_lower or "crop" in text_lower or "soil" in text_lower:
        return (
            f"This agriculture idea can improve farming productivity. It should focus on weather insights, "
            f"crop disease detection, soil health analysis, irrigation planning, and low-cost mobile access. "
            f"Current feasibility is {score}/100 with {risk.lower()} risk."
        )

    if "health" in text_lower or "patient" in text_lower or "medical" in text_lower:
        return (
            f"This healthcare idea has strong social value but needs careful accuracy, privacy, and compliance planning. "
            f"It should focus on safe recommendations, secure patient data handling, and expert validation. "
            f"Current feasibility is {score}/100 with {risk.lower()} risk."
        )

    return (
        f"This idea has potential, but it needs clearer target users, stronger differentiation, implementation details, "
        f"cost planning, and validation with real users. Current feasibility is {score}/100 with {risk.lower()} risk."
    )


def generate_selection_reason(text: str, score: int, risk: str) -> str:
    text_lower = (text or "").lower()

    if "farmer" in text_lower or "agriculture" in text_lower or "irrigation" in text_lower:
        return (
            f"Selected because this agriculture-focused idea solves a practical field problem, "
            f"supports water/resource optimization, and has a feasibility score of {score}/100 with {risk.lower()} risk."
        )

    if "health" in text_lower or "mental" in text_lower or "patient" in text_lower:
        return (
            f"Selected because this healthcare-focused idea addresses a real user need, "
            f"has strong social impact, and shows {score}/100 feasibility with {risk.lower()} risk."
        )

    if "education" in text_lower or "student" in text_lower or "learning" in text_lower:
        return (
            f"Selected because this education idea has scalable learning impact, clear user value, "
            f"and a feasibility score of {score}/100 with {risk.lower()} risk."
        )

    if "resume" in text_lower or "job" in text_lower or "career" in text_lower:
        return (
            f"Selected because this career-focused idea can help users improve employability, "
            f"matches a clear market need, and has {score}/100 feasibility."
        )

    if "waste" in text_lower or "garbage" in text_lower:
        return (
            f"Selected because this smart waste management idea improves urban cleanliness, "
            f"reduces operational waste, and has {score}/100 feasibility with {risk.lower()} risk."
        )

    if "disaster" in text_lower or "flood" in text_lower or "earthquake" in text_lower:
        return (
            f"Selected because this disaster response idea has high public safety impact, "
            f"supports early warning systems, and has {score}/100 feasibility with {risk.lower()} risk."
        )

    if "drone" in text_lower or "surveillance" in text_lower:
        return (
            f"Selected because this security idea is innovative, but it requires strong privacy, safety, "
            f"and regulatory controls due to {risk.lower()} risk."
        )

    if "traffic" in text_lower or "transport" in text_lower:
        return (
            f"Selected because this transport idea can improve efficiency and reduce congestion, "
            f"with a feasibility score of {score}/100 and {risk.lower()} risk."
        )

    if "fake news" in text_lower or "misinformation" in text_lower:
        return (
            f"Selected because this idea tackles misinformation, has strong social relevance, "
            f"and shows {score}/100 feasibility."
        )

    if "ai" in text_lower or "machine learning" in text_lower:
        return (
            f"Selected because this AI-driven idea has innovation potential, scalable use cases, "
            f"and a feasibility score of {score}/100 with {risk.lower()} risk."
        )

    return (
        f"Selected because this idea shows practical value, reasonable feasibility "
        f"({score}/100), and manageable implementation risk."
    )