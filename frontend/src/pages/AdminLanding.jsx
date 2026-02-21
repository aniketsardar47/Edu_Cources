import { Link } from "react-router-dom";
import { Shield, ChevronRight, LayoutDashboard, UserPlus, LogIn } from "lucide-react";

const AdminLanding = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-4xl w-full relative">
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 mb-6 group transition-transform hover:scale-105">
                        <Shield className="w-10 h-10 text-purple-400 group-hover:rotate-12 transition-transform" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        Admin <span className="text-purple-500">Portal</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Manage your courses, students, and content through our advanced administrative command center.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in animate-delay-1">
                    {/* Login Card */}
                    <Link
                        to="/admin/login"
                        className="glass p-8 rounded-3xl group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/30"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <LogIn className="w-24 h-24 text-white" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
                                <LogIn className="w-7 h-7 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                                Sign In <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                Access your administrative dashboard to manage existing content and review analytics.
                            </p>
                        </div>
                    </Link>

                    {/* Signup Card */}
                    <Link
                        to="/admin/signup"
                        className="glass p-8 rounded-3xl group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/30"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <UserPlus className="w-24 h-24 text-white" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                                <UserPlus className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                                Register <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                New administrator? Create an account to start building and managing your educational empire.
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Footer info */}
                <div className="mt-16 text-center animate-fade-in animate-delay-2">
                    <div className="inline-flex items-center gap-4 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="text-sm font-medium tracking-widest uppercase">Edu_Cources Infrastructure</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLanding;
