from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from .analyzer import analyze_idea
from .duplicate_checker import check_duplicate
from .roadmap_generator import generate_roadmap

app = FastAPI(title="VisionFlow AI Engine MVP")

class IdeaRequest(BaseModel):
    title: str
    description: str
    existingIdeas: Optional[List[str]] = []

class IdeaResponse(BaseModel):
    feasibilityScore: int
    riskLevel: str
    duplicatePercentage: int
    roadmap: List[str]
    aiFeedback: str

@app.post("/analyze", response_model=IdeaResponse)
def analyze_endpoint(request: IdeaRequest):
    # Combine title and description for comprehensive analysis
    full_text = f"{request.title}. {request.description}"
    
    # 1. Analyze feasibility and risk
    analysis_results = analyze_idea(full_text)
    
    # 2. Check for duplicates
    duplicate_results = check_duplicate(full_text, request.existingIdeas)
    
    # 3. Generate roadmap
    roadmap_steps = generate_roadmap(full_text)
    
    # Combine all results into the final response
    return {
        "feasibilityScore": analysis_results["feasibilityScore"],
        "riskLevel": analysis_results["riskLevel"],
        "duplicatePercentage": duplicate_results["duplicatePercentage"],
        "roadmap": roadmap_steps,
        "aiFeedback": analysis_results["aiFeedback"]
    }
