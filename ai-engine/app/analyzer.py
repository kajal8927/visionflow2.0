def analyze_idea(text: str) -> dict:
    """
    Analyzes an idea text to provide feasibility score, risk level, and AI feedback.
    Uses simple heuristics based on length and keywords.
    """
    text_lower = text.lower()
    
    # Base score on length of description (more detail = higher base score)
    word_count = len(text_lower.split())
    base_score = min(60, word_count)  # Max 60 points from length
    
    # Bonus points for structural keywords
    keywords = ["user", "market", "revenue", "platform", "solution", "problem", "data", "app", "web"]
    keyword_bonus = sum(1 for kw in keywords if kw in text_lower) * 4
    
    # Calculate feasibility score (0 - 100)
    feasibility_score = min(100, base_score + keyword_bonus + 10) # +10 as base starting point
    
    # Determine Risk Level
    if feasibility_score >= 80:
        risk_level = "Low"
    elif feasibility_score >= 50:
        risk_level = "Medium"
    else:
        risk_level = "High"
        
    # Generate AI Feedback
    if risk_level == "Low":
        ai_feedback = "This is a well-detailed idea with clear scope. High potential for execution."
    elif risk_level == "Medium":
        ai_feedback = "The idea has potential but lacks some specific details. Consider defining the target market and revenue model more clearly."
    else:
        ai_feedback = "The description is quite brief. Please provide more context about the problem and your proposed solution to lower the risk level."
        
    return {
        "feasibilityScore": feasibility_score,
        "riskLevel": risk_level,
        "aiFeedback": ai_feedback
    }
