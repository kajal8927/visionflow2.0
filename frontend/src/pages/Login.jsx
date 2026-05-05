import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Lock, Mail, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "user@visionflow.com",
    password: "user123",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clean up the state so message doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    const result = await login(form.email, form.password);

    setLoading(false);

    if (!result.success) {
      setError(result.message || "Invalid login credentials");
      return;
    }

    navigate(result.user.role === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_bottom,rgba(139,92,246,0.18),transparent_35%)] pointer-events-none" />

      <div className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-black">Welcome Back</h1>
          <p className="mt-2 text-sm text-slate-400">
            Login to continue VisionFlow.
          </p>
        </div>

        {successMessage && (
          <div className="mb-5 rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-200 text-center">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Email
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
              <Mail className="h-5 w-5 text-cyan-300" />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                className="w-full bg-transparent text-sm text-white outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Password
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
              <Lock className="h-5 w-5 text-cyan-300" />
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                className="w-full bg-transparent text-sm text-white outline-none"
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-3 font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-400">
          <p>User: user@visionflow.com / user123</p>
          <p>Admin: admin@visionflow.com / admin123</p>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          New here?{" "}
          <Link to="/register" className="font-semibold text-cyan-300">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;