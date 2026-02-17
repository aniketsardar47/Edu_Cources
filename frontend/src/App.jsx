import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CoursePage from "./pages/CoursePage";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import TestPage from "./pages/TestPage"; // Add this import

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#0a1929] to-[#1e2f4a]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/video/:courseId/:videoId" element={<VideoPlayerPage />} />
          <Route path="/test/:courseId/:videoId" element={<TestPage />} /> {/* Add test route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;