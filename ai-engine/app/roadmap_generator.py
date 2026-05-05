def generate_roadmap(text: str) -> list[str]:
    """
    Generates a generic roadmap based on simple heuristics of the idea text.
    In a real AI engine, this would use an LLM.
    """
    text_lower = text.lower()
    
    # Base generic roadmap
    roadmap = [
        "Research market and analyze competitors",
        "Define MVP (Minimum Viable Product) features",
        "Design wireframes and UI/UX",
        "Develop backend architecture and database",
        "Build frontend user interface",
    ]
    
    # Add dynamic steps based on keywords
    if "ai" in text_lower or "machine learning" in text_lower or "model" in text_lower:
        roadmap.insert(3, "Train and integrate AI/ML models")
        
    if "app" in text_lower or "mobile" in text_lower or "ios" in text_lower or "android" in text_lower:
        roadmap.append("Publish application to App Store / Google Play")
    else:
        roadmap.append("Deploy web application to production servers")
        
    roadmap.extend([
        "Conduct user testing and gather feedback",
        "Launch product and begin marketing campaigns"
    ])
    
    return roadmap
