import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/AdminApi";
import { UserPlus, Mail, Lock, User, Phone, ChevronLeft, ShieldPlus } from "lucide-react";

const AdminSignup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
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

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/admin/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        phone: form.phone
      });

      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("adminRole", response.data.admin.role);
      localStorage.setItem("adminEmail", response.data.admin.email);

      navigate("/admin/dashboard");
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none"></div>

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
              <ShieldPlus className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Create Identity</h1>
            <p className="text-gray-400 font-medium">New administrator registration</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <p className="text-red-400 text-sm font-bold text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Commander Name"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-2xl focus:border-purple-500/50 outline-none transition-all text-white placeholder:text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Email System</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@edu-cources.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-2xl focus:border-purple-500/50 outline-none transition-all text-white placeholder:text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Secure Passcode</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-2xl focus:border-purple-500/50 outline-none transition-all text-white placeholder:text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Confirm Security</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-2xl focus:border-purple-500/50 outline-none transition-all text-white placeholder:text-gray-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all hover:scale-[1.02] shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus size={20} />
                  Authorize Registration
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm font-medium">
              Existing commander?{" "}
              <button
                onClick={() => navigate("/admin/login")}
                className="text-purple-400 hover:text-purple-300 font-bold transition-colors"
              >
                Access Portal
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
