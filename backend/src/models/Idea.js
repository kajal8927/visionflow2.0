import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Idea title is required"],
      trim: true,

      maxlength: [300, "Idea title cannot be more than 300 characters"],

      maxlength: 150,
    },
    category: {
      type: String,
      default: "Other",
      trim: true,
    },
    problemStatement: {
      type: String,
      required: [true, "Problem statement is required"],
      trim: true,
    },
    proposedSolution: {
      type: String,
      required: [true, "Proposed solution is required"],
      trim: true,
    },
    targetUsers: {
      type: String,
      default: "General Users",
      trim: true,
    },
    budget: {
      type: String,
      default: "Not specified",
      trim: true,
    },
    timeline: {
      type: String,
      default: "Not specified",
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "duplicate", "rejected", "selected"],
      default: "pending",
    },
    feasibilityScore: {
      type: Number,
      default: 0,
    },
    riskLevel: {
      type: String,
      default: "Pending",
    },
    duplicatePercentage: {
      type: Number,
      default: 0,
    },
    matchedIdeas: {
      type: [String],
      default: [],
    },
    roadmap: {
      type: [String],
      default: [],
    },
    aiFeedback: {
      type: String,
      default: "AI analysis pending.",
    },
    ideaValue: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
      default: null,
    },
    selectionReason: {
      type: String,
      default: "",
    },
    rejectionReason: {
  type: String,
  default: "",
},
  },

  { timestamps: true }
);

const Idea = mongoose.model("Idea", ideaSchema);

export default Idea;