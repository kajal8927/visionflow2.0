import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getIdeaByIdApi, downloadIdeaReportApi } from "../services/ideaService.js";
import { Loader2, Download } from "lucide-react";

const IdeaDetails = () => {
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadReport = async () => {
    setDownloading(true);
    await downloadIdeaReportApi(id);
    setDownloading(false);
  };

  useEffect(() => {
    const fetchIdea = async () => {
      setLoading(true);

      try {
        const result = await getIdeaByIdApi(id);

        if (result.success && result.idea) {
          setIdea(result.idea);
        } else {
          setError(result.message || "Idea not found.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Idea not found.");
      }

      setLoading(false);
    };

    fetchIdea();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-slate-400">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-cyan-500" />
        <p>Loading idea details...</p>
      </main>
    );
  }

  if (error || !idea) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-white">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-200">
            Idea not found
          </h2>
          <p className="mb-8 text-slate-400">
            {error || "The idea you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/dashboard"
            className="rounded-xl bg-cyan-500 px-6 py-3 font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-600"
          >
            Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const isSelected = idea.status === "selected";
  const isRejected = idea.status === "rejected";

  return (
    <main className="min-h-screen bg-slate-950 p-6 pt-24 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-cyan-300"
          >
            ← Back to Dashboard
          </Link>

          <button
            onClick={handleDownloadReport}
            disabled={downloading || !idea}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-cyan-300 shadow-lg transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {downloading ? "Generating PDF..." : "Download Report"}
          </button>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-xl md:p-10">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />

          <div className="relative">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <h1 className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-3xl font-black text-transparent md:text-4xl">
                {idea.rank && (
                  <span className="mr-3 text-violet-400">#{idea.rank}</span>
                )}
                {idea.title}
              </h1>

              <span
                className={`self-start rounded-full border px-4 py-1.5 text-sm font-bold md:self-auto ${
                  isRejected
                    ? "border-red-500/20 bg-red-500/10 text-red-300"
                    : isSelected
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                    : "border-white/10 bg-white/5 text-slate-200"
                }`}
              >
                {idea.status}
              </span>
            </div>

            <div className="grid gap-8">
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Description
                </h3>
                <div className="rounded-2xl border border-white/5 bg-black/20 p-5 leading-relaxed text-slate-300 md:p-6 whitespace-pre-wrap">
                  {idea.description}
                </div>
              </div>

              {isRejected ? (
                <div>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-red-400/80">
                    Why this idea was rejected
                  </h3>
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 leading-relaxed text-red-50/90 md:p-6">
                    {idea.rejectionReason ||
                      idea.selectionReason ||
                      "This idea was rejected because it was weaker compared to the selected top ideas."}
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/20 p-5 text-center">
                      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                        Status
                      </h3>
                      <div
                        className={`rounded-full px-3 py-1 text-sm font-bold capitalize ${
                          isSelected
                            ? "bg-emerald-500/10 text-emerald-300"
                            : "bg-white/10 text-slate-300"
                        }`}
                      >
                        {idea?.status || "Pending"}
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/20 p-5 text-center">
                      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                        Idea Value
                      </h3>
                      <div className="text-xl font-black text-cyan-400">
                        {idea?.ideaValue ?? "N/A"}
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/20 p-5 text-center">
                      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                        Feasibility
                      </h3>
                      <div className="text-xl font-black text-green-400">
                        {idea?.feasibilityScore ?? 0}/100
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/20 p-5 text-center">
                      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                        Risk Level
                      </h3>
                      <div className="font-bold text-slate-200">
                        {idea?.riskLevel || "Pending"}
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/20 p-5 text-center">
                      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                        Duplicates
                      </h3>
                      <div className="font-bold text-slate-200">
                        {idea?.duplicatePercentage ?? 0}%
                      </div>
                    </div>
                  </div>

                  {isSelected && idea.selectionReason && (
                    <div>
                      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-400/80">
                        Why this idea was selected
                      </h3>
                      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 leading-relaxed text-emerald-50/90 md:p-6">
                        {idea.selectionReason}
                      </div>
                    </div>
                  )}

                  {(idea?.roadmap || []).length > 0 && (
                    <div>
                      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                        Generated Roadmap
                      </h3>
                      <div className="rounded-2xl border border-white/5 bg-black/20 p-5 md:p-6">
                        <ol className="list-inside list-decimal space-y-3 text-slate-300">
                          {(idea?.roadmap || []).map((step, idx) => (
                            <li key={idx} className="pl-2 leading-relaxed">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}

                  {idea.aiFeedback && (
                    <div>
                      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-violet-400/70">
                        AI Analysis Feedback
                      </h3>
                      <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 p-5 leading-relaxed text-slate-200 shadow-inner md:p-6 whitespace-pre-wrap">
                        {idea.aiFeedback}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IdeaDetails;