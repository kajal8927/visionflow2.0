import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Sparkles, Loader2, WandSparkles } from "lucide-react";
import IdeaCard from "../components/IdeaCard.jsx";
import StatCard from "../components/StatCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { getMyIdeasApi, aiCompareIdeasApi } from "../services/ideaService.js";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("Selected");

  const { user } = useAuth();

  const fetchIdeas = async () => {
    setLoading(true);
    setError(null);

    const result = await getMyIdeasApi();

    if (result.success) {
      setIdeas(result.ideas);
    } else {
      setError(result.message || "Failed to fetch ideas.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handleAiCompare = async () => {
    setAiLoading(true);
    setError(null);

    const res = await aiCompareIdeasApi();

    if (res.success) {
      setIdeas(res.ideas);
      alert("AI comparison done ✅");
    } else {
      setError(res.message || "AI comparison failed.");
    }

    setAiLoading(false);
  };

  const filteredIdeas = ideas.filter((idea) => {
    if (filter === "All") return true;
    if (filter === "Selected") return idea.status === "selected";
    if (filter === "Rejected") return idea.status === "rejected";
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-950 p-6 pt-24 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 shadow-2xl md:p-12">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 bg-cyan-500/10 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 bg-violet-500/10 blur-[100px]" />

          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-300">
                <Sparkles className="h-3 w-3" />
                <span>Workspace Active</span>
              </div>

              <h1 className="mb-2 text-3xl font-black text-white md:text-5xl">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                  {user?.name?.split(" ")[0] || "Innovator"}
                </span>
              </h1>

              <p className="max-w-xl text-lg text-slate-400">
                Ready to transform another idea into reality? Here's an overview
                of your current projects.
              </p>
            </div>

            <Link
              to="/submit-idea"
              className="group inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3.5 font-bold text-white shadow-xl shadow-cyan-500/20 transition-all hover:scale-105"
            >
              <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
              <span>Submit New Idea</span>
            </Link>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard title="Total Ideas" value={ideas.length} />
          <StatCard
            title="Selected"
            value={ideas.filter((i) => i.status === "selected").length}
          />
          <StatCard
            title="Rejected"
            value={ideas.filter((i) => i.status === "rejected").length}
          />
        </div>

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-200">
              Your Projects
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
                {filteredIdeas.length}
              </span>
            </h2>

            <button
              type="button"
              onClick={handleAiCompare}
              disabled={aiLoading || loading || ideas.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {aiLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <WandSparkles className="h-4 w-4" />
              )}
              {aiLoading ? "Analyzing..." : "AI Compare"}
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
            {["All", "Selected", "Rejected"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-all ${
                  filter === f
                    ? "bg-cyan-500/20 text-cyan-300 shadow-sm"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-red-400">
            {error}
          </div>
        )}

        <div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-cyan-500" />
              <p>Loading your ideas...</p>
            </div>
          ) : ideas.length === 0 ? (
            <EmptyState />
          ) : filteredIdeas.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] py-16 text-center text-slate-400">
              No ideas found for {filter}.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredIdeas.map((idea) => (
                <IdeaCard key={idea.id || idea._id} idea={idea} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;