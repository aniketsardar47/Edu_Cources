import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/AdminApi";
import { LogOut, User, LayoutDashboard, BookOpen, Video, Settings, Plus, Activity, ShieldCheck, Clock, Smartphone, Mail as MailIcon } from "lucide-react";
import AddCourseModal from "../components/AddCourseModal";
import UploadVideoModal from "../components/UploadVideoModal";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState([]);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showUploadVideoModal, setShowUploadVideoModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/admin/profile");
        setAdminData(response.data.admin);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchCourses();
    fetchAllVideos();
  }, [navigate]);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses");
      setCourses(response.data || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const fetchAllVideos = async () => {
    try {
      const response = await api.get("/videos");
      setVideos(response.data || []);
    } catch (error) {
      console.error("Failed to fetch all videos:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/admin/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRole");
      localStorage.removeItem("adminEmail");
      navigate("/admin/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="glass p-10 rounded-[2.5rem] text-center max-w-md">
          <p className="text-gray-400 mb-6 font-bold">Session Authentication Failed</p>
          <button
            onClick={() => navigate("/admin/login")}
            className="w-full py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all"
          >
            Reconnect Terminal
          </button>
        </div>
      </div>
    );
  }

  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 relative overflow-hidden group ${activeTab === id
        ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
        : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
        }`}
    >
      <Icon size={18} />
      {label}
      {activeTab === id && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30"></div>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
      {/* Sidebar / Navigation */}
      <div className="fixed top-0 left-0 h-full w-20 lg:w-72 bg-[#0a0a0a] border-r border-white/5 z-40 hidden md:flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/40">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tighter hidden lg:block uppercase">Nexus<span className="text-purple-500">Admin</span></h1>
          </div>

          <nav className="space-y-4">
            <TabButton id="overview" icon={LayoutDashboard} label="Overview" />
            <TabButton id="courses" icon={BookOpen} label="Courses" />
            <TabButton id="videos" icon={Video} label="Videos" />
            <TabButton id="settings" icon={Settings} label="Settings" />
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 font-bold"
          >
            <LogOut size={20} />
            <span className="hidden lg:block">System Exit</span>
          </button>
        </div>
      </div>

      <main className="md:ml-20 lg:ml-72 min-h-screen">
        {/* Top Navbar */}
        <header className="glass sticky top-0 z-30 border-b border-white/5 backdrop-blur-2xl">
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-purple-500 mb-1">Node Terminal</h2>
              <p className="text-sm font-bold text-gray-500">Welcome, Commander {adminData.name.split(' ')[0]}</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden sm:flex flex-col text-right">
                <p className="text-sm font-black">{adminData.name}</p>
                <p className="text-[10px] font-black uppercase text-gray-600 tracking-widest">{adminData.role}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-white/5 p-[1px]">
                <div className="w-full h-full rounded-2xl bg-[#0a0a0a] flex items-center justify-center">
                  <User className="text-purple-400" size={20} />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 lg:p-12">
          {/* Overview Section */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in">
              {/* Hero Statistics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass p-10 rounded-[3rem] border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:scale-110 transition-transform duration-1000">
                    <Activity size={200} />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-black mb-4 tracking-tighter">System Health: <span className="text-purple-500">Optimal</span></h3>
                    <p className="text-gray-400 font-medium mb-8 max-w-md">Nexus terminal is synchronized with global database. All administrative protocols are green.</p>
                    <div className="flex gap-4">
                      <button onClick={() => setActiveTab("courses")} className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all flex items-center gap-2">
                        <Plus size={18} /> Deploy Course
                      </button>
                    </div>
                  </div>
                </div>

                <div className="glass p-10 rounded-[3rem] border-white/5 flex flex-col justify-center gap-6 bg-purple-600/5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-widest text-purple-400">Database Load</p>
                    <Activity className="text-purple-500" size={16} />
                  </div>
                  <div className="space-y-4">
                    <div className="h-3 w-full bg-[#0a0a0a] rounded-full overflow-hidden">
                      <div className="h-full w-[65%] bg-purple-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
                    </div>
                    <div className="flex justify-between text-xs font-black text-gray-500">
                      <span>CAPACITY: 1.2TB</span>
                      <span>USAGE: 65%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: "Total Courses", value: courses.length, icon: BookOpen, color: "text-blue-400" },
                  { label: "Media Assets", value: videos.length, icon: Video, color: "text-green-400" },
                  { label: "Status", value: adminData.isActive ? "Online" : "Offline", icon: Activity, color: "text-purple-400" }
                ].map((stat, i) => (
                  <div key={i} className="glass p-8 rounded-[2.5rem] border-white/5 hover:border-purple-500/20 transition-all group">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-4 bg-white/5 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}>
                        <stat.icon size={24} />
                      </div>
                      <p className="text-xs font-black text-gray-600 uppercase tracking-widest">Live Registry</p>
                    </div>
                    <h4 className="text-gray-500 font-black uppercase tracking-widest text-xs mb-1">{stat.label}</h4>
                    <p className="text-3xl font-black">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courses Section */}
          {activeTab === "courses" && (
            <div className="animate-fade-in">
              <div className="glass p-10 rounded-[3rem] border-white/5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
                  <div>
                    <h3 className="text-3xl font-black tracking-tight mb-2">Curriculum Control</h3>
                    <p className="text-gray-500 font-medium">Manage and deploy educational course modules</p>
                  </div>
                  <button
                    onClick={() => setShowAddCourseModal(true)}
                    className="px-8 py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all flex items-center gap-3 shadow-xl shadow-purple-500/20"
                  >
                    <Plus size={20} /> Add New Entry
                  </button>
                </div>

                {courses.length > 0 ? (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {courses.map((course) => (
                      <div key={course._id} className="glass p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.04] transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-xl font-bold tracking-tight text-white group-hover:text-purple-400 transition-colors uppercase">{course.title}</h4>
                          <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-gray-500 font-black tracking-widest uppercase">Node_ID: {course._id.slice(-6)}</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-8 line-clamp-2 leading-relaxed">{course.description}</p>
                        <div className="flex gap-3">
                          <button className="flex-1 px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors">Configure</button>
                          <button className="flex-1 px-4 py-3 bg-red-500/10 border border-red-500/10 rounded-xl text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-white transition-all">Decommission</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white/5 rounded-[2.5rem]">
                    <BookOpen size={64} className="mx-auto text-gray-700 mb-6" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest">No local entries detected in Curriculum Grid</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Videos Section */}
          {activeTab === "videos" && (
            <div className="animate-fade-in">
              <div className="glass p-10 rounded-[3rem] border-white/5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
                  <div>
                    <h3 className="text-3xl font-black tracking-tight mb-2">Media Repository</h3>
                    <p className="text-gray-500 font-medium">Global CDN synchronization and asset management</p>
                  </div>
                  <button
                    onClick={() => setShowUploadVideoModal(true)}
                    className="px-8 py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all flex items-center gap-3 shadow-xl shadow-purple-500/20"
                  >
                    <Plus size={20} /> Upload Asset
                  </button>
                </div>

                {videos.length > 0 ? (
                  <div className="space-y-4">
                    {videos.map((video) => (
                      <div key={video._id} className="glass p-6 rounded-[2rem] border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center gap-6 flex-1 min-w-0">
                          <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 text-purple-400 shrink-0">
                            <Video size={24} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-white truncate text-lg uppercase tracking-tight">{video.title}</h4>
                            <p className="text-xs font-black text-gray-600 uppercase tracking-widest mt-1">
                              REL: {courses.find(c => c._id === video.courseId)?.title || "ORPHANED"} | SEQUENCE: {video.order || "---"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3 shrink-0">
                          <button className="px-5 py-2.5 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10">Refactor</button>
                          <button className="px-5 py-2.5 bg-red-500/10 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Purge</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white/5 rounded-[2.5rem]">
                    <Video size={64} className="mx-auto text-gray-700 mb-6" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest">Asset Repository Empty</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Section */}
          {activeTab === "settings" && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Grid */}
                <div className="glass p-10 rounded-[3rem] border-white/5">
                  <h3 className="text-2xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter">
                    <ShieldCheck className="text-purple-500" /> Security Clearance
                  </h3>

                  <div className="space-y-6">
                    {[
                      { label: "Designation", value: adminData.name, icon: User },
                      { label: "Comm Channel", value: adminData.email, icon: MailIcon },
                      { label: "Secure Link", value: adminData.phone || "Not Registered", icon: Smartphone },
                      { label: "Last Sync", value: adminData.lastLogin ? new Date(adminData.lastLogin).toLocaleString() : "Never", icon: Clock }
                    ].map((item, i) => (
                      <div key={i}>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-2 block ml-1">{item.label}</label>
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                          <item.icon size={18} className="text-purple-400" />
                          <span className="font-bold text-gray-300">{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Password Grid */}
                <div className="glass p-10 rounded-[3rem] border-white/5">
                  <h3 className="text-2xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter">
                    <Settings className="text-purple-500" /> Protocol Override
                  </h3>
                  <div className="space-y-6">
                    {["Current Keychain", "New Identifier", "Confirm Identity"].map((p, i) => (
                      <div key={i}>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-2 block ml-1">{p}</label>
                        <input
                          type="password"
                          placeholder="••••••••••••"
                          className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl focus:border-purple-500/50 outline-none font-bold"
                        />
                      </div>
                    ))}
                    <button className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all uppercase tracking-widest text-xs mt-4">
                      Update Security Protocols
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AddCourseModal
        isOpen={showAddCourseModal}
        onClose={() => setShowAddCourseModal(false)}
        onSuccess={fetchCourses}
      />

      <UploadVideoModal
        isOpen={showUploadVideoModal}
        onClose={() => setShowUploadVideoModal(false)}
        onSuccess={() => {
          fetchCourses();
          fetchAllVideos();
        }}
        courses={courses}
      />
    </div>
  );
};

export default AdminDashboard;
