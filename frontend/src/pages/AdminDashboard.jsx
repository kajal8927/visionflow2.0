import { useState, useEffect } from "react";
import { getMyIdeasApi } from "../services/ideaService.js";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import EmptyState from "../components/EmptyState.jsx";

const AdminDashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      const result = await getMyIdeasApi();
      if (result.success) {
        setIdeas(result.ideas);
      } else {
        setError(result.message || "Failed to fetch ideas.");
      }
      setLoading(false);
    };

    fetchIdeas();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 p-6 pt-24 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-violet-400 mb-8">Admin Dashboard</h1>

        <div className="grid gap-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-violet-500" />
              <p>Loading system ideas...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 border border-red-500/20 rounded-2xl bg-red-500/5 text-red-400">
              <p>{error}</p>
            </div>
          ) : ideas.length === 0 ? (
            <EmptyState />
          ) : (
            ideas.map((idea) => (
              <div key={idea.id || idea._id} className="flex flex-col md:flex-row md:items-center justify-between border border-white/10 rounded-xl bg-white/[0.02] p-5 hover:bg-white/[0.05] transition gap-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-200">{idea.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-xs text-slate-300 border border-white/10">{idea.category}</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-xs text-slate-300 border border-white/10 capitalize">{idea.status}</span>
                  </div>
                </div>
                <Link 
                  to={`/ideas/${idea.id || idea._id}`}
                  className="self-start md:self-auto px-5 py-2 rounded-lg bg-violet-500/20 text-violet-300 font-semibold text-sm hover:bg-violet-500/30 transition shrink-0"
                >
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;