import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, Sparkles, User } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const result = await register(form);
    setLoading(false);

    if (!result.success) {
      setError(result.message || "Registration failed.");
      return;
    }

    navigate("/login", { state: { message: result.message || "Account created successfully. Please login to continue." } });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_bottom,rgba(139,92,246,0.18),transparent_35%)]" />

      <div className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-black">Create Account</h1>
          <p className="mt-2 text-sm text-slate-400">
            Start your idea journey with VisionFlow.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Full Name
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
              <User className="h-5 w-5 text-cyan-300" />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-transparent text-sm text-white outline-none"
                required
              />
            </div>
          </div>

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
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have account?{" "}
          <Link to="/login" className="font-semibold text-cyan-300">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;