import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, History as HistoryIcon } from "lucide-react";
import { getMyIdeasApi } from "../services/ideaService.js";

const History = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      const result = await getMyIdeasApi();

      if (result.success) {
        setIdeas(result.ideas || []);
      } else {
        setError(result.message || "Failed to load history.");
      }

      setLoading(false);
    };

    fetchIdeas();
  }, []);

  const filteredIdeas = ideas.filter((idea) => {
    if (filter === "All") return true;
    return idea.status === filter.toLowerCase();
  });

  return (
    <main className="min-h-screen bg-slate-950 p-6 pt-24 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-300">
              <HistoryIcon className="h-4 w-4" />
              Idea History
            </div>

            <h1 className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-4xl font-black text-transparent">
              Submission History
            </h1>

            <p className="mt-2 text-slate-400">
              View all submitted ideas with their selected or rejected status.
            </p>
          </div>

          <Link
            to="/submit-idea"
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-3 font-bold text-white shadow-lg shadow-cyan-500/20"
          >
            Submit New Idea
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-400">Total Ideas</p>
            <h2 className="mt-2 text-3xl font-black text-white">
              {ideas.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
            <p className="text-sm text-emerald-300">Selected</p>
            <h2 className="mt-2 text-3xl font-black text-emerald-300">
              {ideas.filter((i) => i.status === "selected").length}
            </h2>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
            <p className="text-sm text-red-300">Rejected</p>
            <h2 className="mt-2 text-3xl font-black text-red-300">
              {ideas.filter((i) => i.status === "rejected").length}
            </h2>
          </div>
        </div>

        <div className="mb-6 flex gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
          {["All", "Selected", "Rejected"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                filter === item
                  ? "bg-cyan-500/20 text-cyan-300"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="mr-3 h-6 w-6 animate-spin text-cyan-400" />
            Loading history...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            {error}
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-slate-400">
            No ideas found.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.04] text-slate-300">
                <tr>
                  <th className="p-4">Rank</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Idea Value</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredIdeas.map((idea) => (
                  <tr
                    key={idea._id || idea.id}
                    className="border-b border-white/5 hover:bg-white/[0.03]"
                  >
                    <td className="p-4 font-bold text-violet-300">
                      {idea.rank ? `#${idea.rank}` : "N/A"}
                    </td>

                    <td className="p-4 font-semibold text-white">
                      {idea.title}
                    </td>

                    <td className="p-4 text-slate-300">{idea.category}</td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                          idea.status === "selected"
                            ? "bg-emerald-500/10 text-emerald-300"
                            : idea.status === "rejected"
                            ? "bg-red-500/10 text-red-300"
                            : "bg-white/10 text-slate-300"
                        }`}
                      >
                        {idea.status}
                      </span>
                    </td>

                    <td className="p-4 text-cyan-300">
                      {idea.ideaValue ?? "N/A"}
                    </td>

                    <td className="p-4 text-slate-400">
                      {idea.createdAt
                        ? new Date(idea.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="p-4">
                      <Link
                        to={`/ideas/${idea._id || idea.id}`}
                        className="rounded-lg bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500 hover:text-white"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default History;