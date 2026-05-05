import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, className = "" }) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
        isActive(to)
          ? "bg-white/10 text-cyan-300 shadow-inner"
          : "text-slate-300 hover:bg-white/5 hover:text-cyan-300"
      } ${className}`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500 hover:opacity-80 transition-opacity drop-shadow-lg">
            VisionFlow
          </Link>
        </div>

        {/* Center: Pill Navigation (Desktop) */}
        <div className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-cyan-500/10">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <Link to="/history">History</Link>
              <NavLink to="/submit-idea">Submit Idea</NavLink>
              {user?.role === "admin" && (
                <NavLink to="/admin" className="text-violet-300 hover:text-violet-400">Admin</NavLink>
              )}
            </>
          ) : (
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/login">Login</NavLink>
            </>
          )}
        </div>

        {/* Right: Auth / Profile (Desktop) */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full px-2 py-1 shadow-lg">
              <span className="text-sm font-medium text-slate-300 pl-4">
                {user?.name || "User"}
              </span>
              <button
                onClick={logout}
                className="px-4 py-1.5 text-sm font-bold rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/register" className="px-6 py-2.5 text-sm font-bold rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/25">
              Register
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 rounded-full bg-slate-900/80 border border-white/10 text-slate-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-6 right-6 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col gap-2 pointer-events-auto">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/submit-idea">Submit Idea</NavLink>
              {user?.role === "admin" && (
                <NavLink to="/admin" className="text-violet-300">Admin</NavLink>
              )}
              <div className="h-px w-full bg-white/10 my-2" />
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm font-medium text-slate-300">
                  {user?.name || "User"}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-bold rounded-full bg-red-500/10 text-red-400"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/login">Login</NavLink>
              <Link to="/register" className="mt-2 text-center px-6 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;