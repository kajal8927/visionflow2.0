from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

from app.analyzer import analyze_idea
from app.duplicate_checker import check_duplicates
from app.roadmap_generator import generate_roadmap

load_dotenv()

app = FastAPI()


class IdeaRequest(BaseModel):
    title: str
    description: str
    existingIdeas: list[str] = []


class IdeaResponse(BaseModel):
    feasibilityScore: int
    riskLevel: str
    duplicatePercentage: float
    roadmap: list[str]
    aiFeedback: str
    selectionReason: str


@app.post("/analyze", response_model=IdeaResponse)
async def analyze(request: IdeaRequest):

    title = request.title.strip()
    description = request.description.strip()

    full_text = f"{title} {description}".strip()

    # Validation
    if not title:
        raise HTTPException(
            status_code=400,
            detail="Idea title is required"
        )

    if not description:
        raise HTTPException(
            status_code=400,
            detail="Idea description is required"
        )

    if len(full_text) < 20:
        raise HTTPException(
            status_code=400,
            detail="Please provide a more detailed idea description"
        )

    try:
        analysis_results = analyze_idea(full_text)

        duplicate_results = check_duplicates(
            full_text,
            request.existingIdeas
        )

        roadmap_steps = generate_roadmap(full_text)

        return IdeaResponse(
            feasibilityScore=analysis_results["feasibilityScore"],
            riskLevel=analysis_results["riskLevel"],
            duplicatePercentage=duplicate_results["duplicatePercentage"],
            roadmap=roadmap_steps,
            aiFeedback=analysis_results["aiFeedback"],
            selectionReason=analysis_results["selectionReason"],
        )

    except Exception as error:
        print("Analyze endpoint error:", str(error))

        raise HTTPException(
            status_code=500,
            detail="Failed to analyze idea"
        )


@app.get("/")
async def root():
    return {
        "message": "VisionFlow AI Engine Running"
    }