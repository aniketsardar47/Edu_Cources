import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/AdminApi";
import { LogOut, User, LayoutDashboard, BookOpen, Video, Settings } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    
    if (!token) {
      navigate("/admin/login");
      return;
    }

    // Fetch admin profile
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/admin/profile");
        setAdminData(response.data.admin);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // Clear token and redirect to login if unauthorized
        if (error.response?.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load admin data</p>
          <button
            onClick={() => navigate("/admin/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-full">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-gray-800 font-semibold">{adminData.name}</p>
              <p className="text-gray-500 text-sm">{adminData.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab("courses")}
            className={`flex items-center gap-2 px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === "courses"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Courses
          </button>

          <button
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-2 px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === "videos"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            <Video className="w-5 h-5" />
            Videos
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === "settings"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        {/* Content Sections */}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Welcome, {adminData.name}!</h2>
              <p className="opacity-90">You are logged in as an {adminData.role}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Total Courses</p>
                    <p className="text-4xl font-bold text-blue-600 mt-2">0</p>
                  </div>
                  <BookOpen className="w-12 h-12 text-blue-100" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Total Videos</p>
                    <p className="text-4xl font-bold text-green-600 mt-2">0</p>
                  </div>
                  <Video className="w-12 h-12 text-green-100" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Account Status</p>
                    <p className="text-xl font-bold text-yellow-600 mt-2">
                      {adminData.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <User className="w-12 h-12 text-yellow-100" />
                </div>
              </div>
            </div>

            {/* Permissions Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Permissions</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={adminData.permissions?.canManageCourses} disabled className="cursor-not-allowed" />
                  <label className="text-gray-700">Can Manage Courses</label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={adminData.permissions?.canManageVideos} disabled className="cursor-not-allowed" />
                  <label className="text-gray-700">Can Manage Videos</label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={adminData.permissions?.canManageAdmins} disabled className="cursor-not-allowed" />
                  <label className="text-gray-700">Can Manage Admins</label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Manage Courses</h3>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                Add New Course
              </button>
            </div>
            <div className="text-center py-12 text-gray-600">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No courses found. Click "Add New Course" to get started.</p>
            </div>
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === "videos" && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Manage Videos</h3>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                Upload New Video
              </button>
            </div>
            <div className="text-center py-12 text-gray-600">
              <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No videos found. Click "Upload New Video" to get started.</p>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Admin Profile Settings */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={adminData.name}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={adminData.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={adminData.phone || "Not provided"}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Login</label>
                  <input
                    type="text"
                    value={adminData.lastLogin ? new Date(adminData.lastLogin).toLocaleString() : "Never"}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>

              <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                Update Profile
              </button>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h3>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <button className="w-full mt-6 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
