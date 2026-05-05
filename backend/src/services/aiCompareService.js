import axios from "axios";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const extractJsonArray = (text = "") => {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");

  if (start === -1 || end === -1) {
    throw new Error("AI response does not contain a valid JSON array.");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
};

export const compareIdeasWithAI = async (ideas = []) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is missing in backend .env file.");
  }

  if (!ideas.length) return [];

  const compactIdeas = ideas.map((idea) => ({
    id: idea._id?.toString(),
    title: idea.title,
    category: idea.category,
    description: idea.description,
    feasibilityScore: idea.feasibilityScore || 0,
    riskLevel: idea.riskLevel || "Pending",
    duplicatePercentage: idea.duplicatePercentage || 0,
    ideaValue: idea.ideaValue || 0,
  }));

  const prompt = `
You are an AI idea evaluator for VisionFlow.

Compare all submitted ideas together and generate ranking, selection/rejection status, reason, and improvement suggestion.

Important selection rule:
- If total ideas are 5 or less, mark ALL ideas as "selected".
- If total ideas are more than 5, select ONLY the best 5 ideas.
- Reject ONLY the weakest ideas beyond the top 5.
- Rank every idea.
- Rank 1 means strongest idea.
- status must be only "selected" or "rejected".
- Selected ideas must have a clear selection reason.
- Rejected ideas must have a clear rejection reason.
- Do not reject any idea if total ideas are 5 or less.

Evaluation criteria:
1. Feasibility score
2. Idea value
3. Duplicate percentage
4. Risk level
5. Practical implementation possibility
6. Social or business impact
7. Uniqueness

Reason rules:
- For selected ideas, explain why it deserves to remain in the top 5.
- For rejected ideas, explain why it is weaker than the selected ideas.
- Mention specific factors like low idea value, higher duplication, lower feasibility, implementation complexity, weaker impact, or lack of uniqueness when relevant.
- Keep reason short, clear, and user-friendly.

Return ONLY valid JSON array.
Do not return markdown.
Do not add explanation outside JSON.

Ideas:
${JSON.stringify(compactIdeas, null, 2)}

Required JSON format:
[
  {
    "id": "idea_id",
    "rank": 1,
    "status": "selected",
    "reason": "Clear reason why this idea is selected or rejected.",
    "suggestion": "Short improvement suggestion."
  }
]
`;

  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: process.env.OPENROUTER_MODEL || "openrouter/free",
        messages: [
          {
            role: "system",
            content:
              "You are a strict AI evaluator. Always return only a valid JSON array.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 2500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5175",
          "X-Title": "VisionFlow",
        },
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("OpenRouter returned empty AI response.");
    }

    return extractJsonArray(content);
  } catch (error) {
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      "OpenRouter AI compare failed.";

    throw new Error(message);
  }
};