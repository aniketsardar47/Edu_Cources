import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PlayCircle, Clock, FileText, ChevronLeft } from "lucide-react";

const CoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Loading course with ID:", courseId);

    if (!courseId || courseId === "undefined") {
      setError("Invalid course ID");
      setLoading(false);
      return;
    }

    // Fetch course details and videos from database
    Promise.all([
      // Get course details
      fetch(`http://localhost:7777/api/courses/${courseId}`)
        .then(res => {
          if (!res.ok) throw new Error(`Course not found (${res.status})`);
          return res.json();
        }),
      // Get videos for this course using your API endpoint
      fetch(`http://localhost:7777/api/videos/course/${courseId}`)
        .then(res => {
          if (!res.ok) throw new Error(`Videos not found (${res.status})`);
          return res.json();
        })
    ])
      .then(([courseData, videosData]) => {
        console.log("Course details:", courseData);
        console.log("Course videos:", videosData);
        
        setCourse(courseData);
        
        // Handle different video response formats
        const videosList = Array.isArray(videosData) ? videosData : 
                          videosData.videos || videosData.data || [];
        setVideos(videosList);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch course data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2d3f5e] border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-500/10 p-8 rounded-2xl border border-red-500/30">
          <p className="text-red-400 text-xl mb-4">
            {error || "Course not found"}
          </p>
          <Link 
            to="/" 
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
      >
        <ChevronLeft size={20} />
        Back to Courses
      </Link>

      {/* Course Header */}
      <div className="bg-gradient-to-r from-[#1e2f4a] to-[#2d3f5e] rounded-2xl p-8 mb-8 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <img
              src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
              alt={course.title}
              className="w-full h-48 md:h-64 object-cover rounded-xl shadow-lg"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3";
              }}
            />
          </div>
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold text-white mb-3">
              {course.title}
            </h1>
            <p className="text-gray-300 mb-4">
              {course.description}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <FileText size={16} />
                <span>{videos.length} Videos</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{course.duration || "Self-paced"}</span>
              </div>
              <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                {course.level || "Beginner"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video List */}
      <div className="bg-gradient-to-br from-[#1e2f4a] to-[#2d3f5e] rounded-2xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Course Videos</h2>
        
        {videos.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No videos available for this course yet.</p>
        ) : (
          <div className="space-y-4">
            {videos.map((video, index) => {
              // Get video ID (MongoDB uses _id)
              const videoId = video._id || video.id;
              
              return (
                <Link
                  key={videoId}
                  to={`/video/${courseId}/${videoId}`}
                  className="block bg-[#0a1929] rounded-xl p-4 hover:bg-[#1e2f4a] transition-all duration-300 border border-gray-700 hover:border-blue-500 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                      <PlayCircle size={24} className="text-blue-400 group-hover:text-blue-300" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-400">Lesson {index + 1}</span>
                        <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full">
                          {video.duration || "10:30"}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">{video.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                        Watch Now
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePage;