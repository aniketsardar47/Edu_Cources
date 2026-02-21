import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/AdminApi";
import { Lock, Mail, LogIn, ChevronLeft, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/admin/login", {
        email: form.email,
        password: form.password
      });

      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("adminRole", response.data.admin.role);
      localStorage.setItem("adminEmail", response.data.admin.email);

      navigate("/admin/dashboard");
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-400 mb-8 transition-colors group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Back to Portal</span>
        </Link>

        <div className="glass p-10 rounded-[2.5rem] border-white/10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 mb-6">
              <ShieldCheck className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-gray-400 font-medium">Identity verification required</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-fade-in">
              <p className="text-red-400 text-sm font-bold text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3 ml-1">
                Admin Identifier
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@edu-cources.com"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border border-white/10 rounded-2xl focus:border-purple-500/50 outline-none transition-all text-white placeholder:text-gray-700 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3 ml-1">
                Access Keychain
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border border-white/10 rounded-2xl focus:border-purple-500/50 outline-none transition-all text-white placeholder:text-gray-700 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all hover:scale-[1.02] shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={20} />
                  Authenticate
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm font-medium">
              New system commander?{" "}
              <button
                onClick={() => navigate("/admin/signup")}
                className="text-purple-400 hover:text-purple-300 font-bold transition-colors"
              >
                Register Credentials
              </button>
            </p>
          </div>
        </div>

        {/* Support info */}
        <p className="mt-8 text-center text-xs text-gray-700 uppercase tracking-widest font-black">
          Edu_Cources Unified Auth System v2.4
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
