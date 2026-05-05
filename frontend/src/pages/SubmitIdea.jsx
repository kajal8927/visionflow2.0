import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitIdeaApi } from "../services/ideaService.js";
import { Loader2 } from "lucide-react";

const MAX_TITLE_LENGTH = 300;

const SubmitIdea = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "Education",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title" && value.length > MAX_TITLE_LENGTH) return;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const title = form.title.trim();
    const description = form.description.trim();

    if (!title) {
      setError("Idea title is required.");
      return;
    }

    if (title.length > MAX_TITLE_LENGTH) {
      setError(`Idea title cannot be more than ${MAX_TITLE_LENGTH} characters.`);
      return;
    }

    if (!description) {
      setError("Detailed description is required.");
      return;
    }

    setLoading(true);

    try {
      const result = await submitIdeaApi({
        title,
        category: form.category,
        description,
        problemStatement: description,
        proposedSolution: description,
      });

      if (result.success && result.idea) {
        navigate(`/ideas/${result.idea.id || result.idea._id}`);
      } else {
        setError(result.message || "Failed to submit idea.");
      }
    } catch (err) {
      setError(err?.message || "Something went wrong while submitting idea.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-4xl font-black text-transparent">
          Submit New Idea
        </h1>

        <p className="mb-8 text-slate-400">
          Share your concept and let our AI engine analyze and build a roadmap for you.
        </p>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-semibold text-slate-300">
                  Idea Title
                </label>

                <span
                  className={`text-xs ${
                    form.title.length > MAX_TITLE_LENGTH * 0.9
                      ? "text-yellow-400"
                      : "text-slate-500"
                  }`}
                >
                  {form.title.length}/{MAX_TITLE_LENGTH}
                </span>
              </div>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                maxLength={MAX_TITLE_LENGTH}
                placeholder="e.g. AI-powered smart irrigation"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-slate-200 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-slate-200 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
              >
                <option className="bg-slate-900">Education</option>
                <option className="bg-slate-900">Healthcare</option>
                <option className="bg-slate-900">Agriculture</option>
                <option className="bg-slate-900">Environment</option>
                <option className="bg-slate-900">AI/ML</option>
                <option className="bg-slate-900">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Detailed Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Explain the problem and your proposed solution..."
                rows={6}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-slate-200 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-4 font-bold text-white shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              {loading ? "Analyzing & Submitting..." : "Submit Idea"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SubmitIdea;