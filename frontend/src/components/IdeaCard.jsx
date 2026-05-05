import { Link } from "react-router-dom";

const IdeaCard = ({ idea }) => {
  const ideaId = idea._id || idea.id;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:bg-white/[0.05]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 opacity-0 transition-opacity group-hover:opacity-100" />

      {idea.rank && (
        <div className="absolute right-0 top-0 rounded-bl-xl bg-gradient-to-bl from-cyan-500 to-violet-500 px-3 py-1 text-sm font-bold text-white shadow-md">
          #{idea.rank}
        </div>
      )}

      <div className="relative z-10 mt-2 flex-1">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 pr-6 text-lg font-bold text-slate-100 transition-colors group-hover:text-cyan-300">
            {idea.title}
          </h3>
        </div>

        <span
          className={`mb-3 inline-block rounded-md border px-2.5 py-1 text-xs font-medium capitalize ${
            idea.status === "selected"
              ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
              : idea.status === "rejected"
              ? "border-red-500/20 bg-red-500/10 text-red-300"
              : "border-white/10 bg-white/5 text-slate-300"
          }`}
        >
          {idea.status}
        </span>

        <p className="mb-4 line-clamp-2 text-sm text-slate-400">
          {idea.description}
        </p>

        {idea.status === "rejected" && idea.rejectionReason && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
            <p className="text-xs font-bold text-red-300">Rejected Reason</p>
            <p className="mt-1 line-clamp-3 text-xs leading-5 text-red-100/80">
              {idea.rejectionReason}
            </p>
          </div>
        )}

        <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border border-white/5 bg-black/20 p-2">
            <div className="mb-1 text-slate-500">Idea Value</div>
            <div className="font-bold text-slate-200">
              {idea.ideaValue ?? "N/A"}
            </div>
          </div>

          <div className="rounded-lg border border-white/5 bg-black/20 p-2">
            <div className="mb-1 text-slate-500">Feasibility</div>
            <div className="font-bold text-green-400">
              {idea.feasibilityScore ?? 0}%
            </div>
          </div>

          <div className="rounded-lg border border-white/5 bg-black/20 p-2">
            <div className="mb-1 text-slate-500">Duplicates</div>
            <div className="font-bold text-slate-200">
              {idea.duplicatePercentage ?? 0}%
            </div>
          </div>

          <div className="rounded-lg border border-white/5 bg-black/20 p-2">
            <div className="mb-1 text-slate-500">Risk</div>
            <div
              className={`font-bold ${
                idea.riskLevel === "High"
                  ? "text-red-400"
                  : idea.riskLevel === "Medium"
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {idea.riskLevel || "N/A"}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-auto flex items-center justify-end border-t border-white/5 pt-4">
        <Link
          to={`/ideas/${ideaId}`}
          className="w-full rounded-lg bg-cyan-500/10 px-4 py-2 text-center text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500 hover:text-white"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default IdeaCard;