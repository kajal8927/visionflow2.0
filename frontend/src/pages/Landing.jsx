import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Zap } from "lucide-react";

const Landing = () => {
  return (
    <main className="relative min-h-screen bg-slate-950 overflow-hidden flex flex-col items-center justify-center text-white">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center pt-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-sm font-semibold mb-8 backdrop-blur-md shadow-lg shadow-cyan-500/10">
          <Sparkles className="w-4 h-4" />
          <span>The Future of Idea Incubation</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-slate-400 drop-shadow-xl">
          Transform Thoughts Into <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Actionable Projects</span>
        </h1>
        
        <p className="mt-8 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          VisionFlow uses advanced AI to analyze, refine, and generate comprehensive roadmaps for your raw ideas. Stop dreaming, start building.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/login"
            className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-8 py-4 font-bold text-white shadow-xl shadow-cyan-500/25 hover:scale-105 transition-all duration-300"
          >
            <Zap className="w-5 h-5 group-hover:animate-pulse" />
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
          </Link>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-8 py-4 font-bold text-slate-200 hover:bg-white/10 hover:text-white hover:scale-105 transition-all duration-300 backdrop-blur-md"
          >
            Create Free Account
          </Link>
        </div>

        {/* Floating Mini Stats or Features (Optional enhancement) */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left opacity-80">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <h3 className="font-bold text-cyan-300">AI Analysis</h3>
            <p className="text-xs text-slate-400 mt-1">Get instant feasibility scores and risk assessment.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <h3 className="font-bold text-violet-300">Smart Roadmaps</h3>
            <p className="text-xs text-slate-400 mt-1">Auto-generated step-by-step execution plans.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hidden md:block">
            <h3 className="font-bold text-fuchsia-300">Duplicate Detection</h3>
            <p className="text-xs text-slate-400 mt-1">Know if your idea already exists in the market.</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Landing;