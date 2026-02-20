import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CoursePage from "./pages/CoursePage";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import TestPage from "./pages/TestPage";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#0a1929] to-[#1e2f4a]">
        <Routes>
          {/* Student Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/video/:courseId/:videoId" element={<VideoPlayerPage />} />
          <Route path="/test/:courseId/:videoId" element={<TestPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;