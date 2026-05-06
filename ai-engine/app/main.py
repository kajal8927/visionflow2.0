from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

from app.analyzer import analyze_idea
from app.duplicate_checker import check_duplicates
from app.roadmap_generator import generate_roadmap

load_dotenv()

app = FastAPI(title="VisionFlow AI Engine MVP")


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


def fallback_response(error_message: str = "") -> IdeaResponse:
    return IdeaResponse(
        feasibilityScore=50,
        riskLevel="Medium",
        duplicatePercentage=0,
        roadmap=[
            "Define the problem, target users, and expected impact",
            "Research competitors and existing market solutions",
            "Finalize MVP features and technical requirements",
            "Design UI/UX flow and database structure",
            "Develop backend APIs and frontend screens",
            "Integrate AI analysis and roadmap generation",
            "Test the product with real users and collect feedback",
            "Deploy the application and monitor performance",
        ],
        aiFeedback=(
            "AI engine fallback mode activated. "
            "The idea was accepted, but full AI analysis could not be completed."
        ),
        selectionReason=(
            "Fallback response generated because AI analysis service failed. "
            f"{error_message}"
        ).strip(),
    )


@app.get("/")
async def root():
    return {
        "message": "VisionFlow AI Engine Running",
        "status": "ok",
    }


@app.get("/health")
async def health():
    return {
        "success": True,
        "message": "AI Engine healthy",
    }


@app.post("/analyze", response_model=IdeaResponse)
async def analyze(request: IdeaRequest):
    title = (request.title or "").strip()
    description = (request.description or "").strip()
    full_text = f"{title} {description}".strip()

    if not title:
        raise HTTPException(
            status_code=400,
            detail="Idea title is required",
        )

    if not description:
        raise HTTPException(
            status_code=400,
            detail="Idea description is required",
        )

    if len(full_text) < 20:
        raise HTTPException(
            status_code=400,
            detail="Please provide a more detailed idea description",
        )

    try:
        analysis_results = analyze_idea(full_text)

        duplicate_results = check_duplicates(
            full_text,
            request.existingIdeas or [],
        )

        roadmap_steps = generate_roadmap(full_text)

        return IdeaResponse(
            feasibilityScore=int(analysis_results.get("feasibilityScore", 50)),
            riskLevel=analysis_results.get("riskLevel", "Medium"),
            duplicatePercentage=float(
                duplicate_results.get("duplicatePercentage", 0)
            ),
            roadmap=roadmap_steps if isinstance(roadmap_steps, list) else [],
            aiFeedback=analysis_results.get(
                "aiFeedback",
                "AI analysis completed.",
            ),
            selectionReason=analysis_results.get(
                "selectionReason",
                "Idea analyzed successfully.",
            ),
        )

    except Exception as error:
        print("AI ENGINE ANALYZE ERROR:", str(error))
        return fallback_response(str(error))