import Idea from "../models/Idea.js";
import axios from "axios";
import PDFDocument from "pdfkit";
import { compareIdeasWithAI } from "../services/aiCompareService.js";

const recalculateAiComparison = async (userId) => {
  const ideas = await Idea.find({ user: userId }).sort({
    ideaValue: -1,
    createdAt: -1,
  });

  if (!ideas.length) return [];

  let aiResults = [];

  try {
    aiResults = await compareIdeasWithAI(ideas);
  } catch (error) {
    console.error("AI compare failed:", error.message);
  }

  const aiMap = new Map();

  aiResults.forEach((result) => {
    if (result?.id) {
      aiMap.set(result.id, result);
    }
  });

  // Final ranking deterministic: ideaValue highest first
  const rankedIdeas = ideas.sort((a, b) => {
    const valueDiff = (b.ideaValue || 0) - (a.ideaValue || 0);
    if (valueDiff !== 0) return valueDiff;

    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  for (let i = 0; i < rankedIdeas.length; i++) {
    const idea = rankedIdeas[i];
    const aiResult = aiMap.get(idea._id.toString());

    idea.rank = i + 1;

    if (i < 5) {
      idea.status = "selected";
      idea.selectionReason =
        aiResult?.reason ||
        `Selected because this idea ranked #${i + 1} among all submitted ideas based on idea value, feasibility, duplication, and risk.`;
      idea.rejectionReason = "";
    } else {
      idea.status = "rejected";
      idea.rejectionReason =
        aiResult?.reason ||
        `Rejected because this idea ranked #${i + 1}, below the selected top 5 ideas.`;
      idea.selectionReason = "";
    }

    if (aiResult?.suggestion) {
      idea.aiFeedback = `${idea.aiFeedback || ""}\n\nAI Suggestion: ${
        aiResult.suggestion
      }`;
    }

    await idea.save();
  }

  return Idea.find({ user: userId }).sort({
    rank: 1,
    createdAt: -1,
  });
};
export const createIdea = async (req, res) => {
  try {
    const {
      title,
      category,
      problemStatement,
      proposedSolution,
      targetUsers,
      budget,
      timeline,
      description,
    } = req.body;

    if (!title || !problemStatement || !proposedSolution || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Title, problem statement, proposed solution and description are required",
      });
    }

    const existingIdeasData = await Idea.find({ user: req.user._id }).select(
      "title description problemStatement proposedSolution"
    );

    const existingIdeaTexts = existingIdeasData.map((idea) =>
      `${idea.title || ""} ${idea.description || ""} ${
        idea.problemStatement || ""
      } ${idea.proposedSolution || ""}`.trim()
    );

    let aiResults;

    try {
      const aiEngineUrl = process.env.AI_ENGINE_URL || "http://127.0.0.1:8000";

      const aiResponse = await axios.post(`${aiEngineUrl}/analyze`, {
        title,
        description,
        existingIdeas: existingIdeaTexts,
      });

      aiResults = aiResponse.data;
    } catch (aiError) {
      console.error("FastAPI Error:", aiError.message);

      aiResults = {
        feasibilityScore: 50,
        riskLevel: "Medium",
        duplicatePercentage: 0,
        roadmap: [],
        aiFeedback: "AI engine unavailable",
      };
    }

    const riskPenalty =
      aiResults.riskLevel === "High"
        ? 20
        : aiResults.riskLevel === "Medium"
        ? 10
        : 0;

    const ideaValue =
      (aiResults.feasibilityScore || 0) -
      (aiResults.duplicatePercentage || 0) -
      riskPenalty;

    const idea = await Idea.create({
      user: req.user._id,
      title,
      category,
      problemStatement,
      proposedSolution,
      targetUsers,
      budget,
      timeline,
      description,
      feasibilityScore: aiResults.feasibilityScore || 0,
      riskLevel: aiResults.riskLevel || "Medium",
      duplicatePercentage: aiResults.duplicatePercentage || 0,
      roadmap: aiResults.roadmap || [],
      aiFeedback: aiResults.aiFeedback || "AI analysis pending.",
      status: "pending",
      ideaValue,
      selectionReason: "",
      rejectionReason: "",
    });

    try {
      await recalculateAiComparison(req.user._id);
    } catch (compareError) {
      console.error("OpenRouter AI Compare Error:", compareError.message);

      idea.selectionReason = "";
      idea.rejectionReason =
        "Idea submitted successfully, but AI comparison failed. Please run AI comparison again.";
      await idea.save();
    }

    const updatedIdea = await Idea.findById(idea._id);

    res.status(201).json({
      success: true,
      idea: updatedIdea,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const compareMyIdeasWithAI = async (req, res) => {
  try {
    const ideas = await Idea.find({ user: req.user._id });

    if (!ideas.length) {
      return res.status(404).json({
        success: false,
        message: "No ideas found to compare.",
      });
    }

    const updatedIdeas = await recalculateAiComparison(req.user._id);

    res.json({
      success: true,
      message: "Ideas compared successfully using AI.",
      ideas: updatedIdeas,
    });
  } catch (error) {
    console.error("AI compare error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message || "AI idea comparison failed.",
    });
  }
};

export const getMyIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ user: req.user._id }).sort({
      rank: 1,
      ideaValue: -1,
      createdAt: -1,
    });

    res.json({
      success: true,
      ideas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found",
      });
    }

    const isOwner = idea.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to access this idea",
      });
    }

    res.json({
      success: true,
      idea,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateIdeaStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found",
      });
    }

    idea.status = status || idea.status;
    await idea.save();

    res.json({
      success: true,
      idea,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const generateIdeaReport = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found",
      });
    }

    const isOwner = idea.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to access this idea",
      });
    }

    const doc = new PDFDocument({ margin: 50 });

    const filename = `IdeaReport-${idea.title.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    )}.pdf`;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc
      .fontSize(24)
      .fillColor("#222222")
      .text("VisionFlow Idea Report", { align: "center" });

    doc.moveDown(1.5);

    doc.fontSize(20).fillColor("#0284c7").text(idea.title);

    doc
      .fontSize(12)
      .fillColor("#64748b")
      .text(
        `Category: ${idea.category}  |  Status: ${idea.status.toUpperCase()}  |  Rank: ${
          idea.rank ? `#${idea.rank}` : "N/A"
        }`
      );

    doc.moveDown();

    doc.rect(50, doc.y, 500, 70).fillAndStroke("#f1f5f9", "#cbd5e1");
    doc.fillColor("#0f172a");

    const currentY = doc.y + 15;

    doc.fontSize(10).text("Idea Value", 70, currentY);
    doc
      .fontSize(14)
      .fillColor("#0ea5e9")
      .text(idea.ideaValue ?? "N/A", 70, currentY + 15);

    doc.fontSize(10).fillColor("#0f172a").text("Feasibility", 170, currentY);
    doc
      .fontSize(14)
      .fillColor("#22c55e")
      .text(`${idea.feasibilityScore ?? 0}%`, 170, currentY + 15);

    doc.fontSize(10).fillColor("#0f172a").text("Risk Level", 270, currentY);

    const riskColor =
      idea.riskLevel === "High"
        ? "#ef4444"
        : idea.riskLevel === "Medium"
        ? "#f59e0b"
        : "#22c55e";

    doc
      .fontSize(14)
      .fillColor(riskColor)
      .text(idea.riskLevel || "Pending", 270, currentY + 15);

    doc.fontSize(10).fillColor("#0f172a").text("Duplicate %", 370, currentY);
    doc
      .fontSize(14)
      .fillColor("#0f172a")
      .text(`${idea.duplicatePercentage ?? 0}%`, 370, currentY + 15);

    doc.moveDown(3);

    doc.x = 50;
    doc.fontSize(16).fillColor("#0f172a").text("Description");
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor("#334155").text(idea.description, {
      width: 500,
      align: "justify",
    });

    doc.moveDown(1.5);

    doc.fontSize(16).fillColor("#0f172a").text("AI Analysis Feedback");
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor("#334155").text(
      idea.aiFeedback || "No feedback available.",
      {
        width: 500,
        align: "justify",
      }
    );

    doc.moveDown(1.5);

    if (idea.status === "selected") {
      doc.fontSize(16).fillColor("#0f172a").text("Selection Reason");
      doc.moveDown(0.5);
      doc.fontSize(12).fillColor("#334155").text(
        idea.selectionReason || "No selection reason available.",
        {
          width: 500,
          align: "justify",
        }
      );
    }

    if (idea.status === "rejected") {
      doc.fontSize(16).fillColor("#0f172a").text("Rejection Reason");
      doc.moveDown(0.5);
      doc.fontSize(12).fillColor("#334155").text(
        idea.rejectionReason || "No rejection reason available.",
        {
          width: 500,
          align: "justify",
        }
      );
    }

    if (idea.roadmap && idea.roadmap.length > 0) {
      doc.addPage();
      doc.fontSize(16).fillColor("#0f172a").text("Generated Roadmap");
      doc.moveDown(0.5);

      idea.roadmap.forEach((step, index) => {
        doc.fontSize(12).fillColor("#334155").text(`${index + 1}. ${step}`, {
          width: 500,
          align: "left",
        });
        doc.moveDown(0.5);
      });
    }

    doc.end();
  } catch (error) {
    console.error("PDF generation error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Error generating report",
      });
    }
  }
};