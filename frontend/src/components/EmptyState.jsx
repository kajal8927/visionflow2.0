import { Link } from "react-router-dom";

const EmptyState = () => {
  return (
    <div className="text-center py-16 border border-white/10 rounded-2xl bg-white/[0.02] shadow-inner mt-4">
      <h3 className="text-xl font-bold text-slate-300 mb-2">No Ideas Yet</h3>
      <p className="text-slate-400 mb-6 max-w-md mx-auto">
        You haven't submitted any ideas yet. Start your journey by creating your first idea!
      </p>
      <Link
        to="/submit-idea"
        className="inline-block px-6 py-3 rounded-xl bg-cyan-500 font-bold text-white hover:bg-cyan-600 transition shadow-lg shadow-cyan-500/20"
      >
        Submit Your First Idea
      </Link>
    </div>
  );
};

export default EmptyState;