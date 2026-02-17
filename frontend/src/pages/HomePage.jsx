import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Users, PlayCircle } from "lucide-react";

const   HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all courses from database
    fetch("http://localhost:7777/api/courses")
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Courses from DB:", data);
        // Handle different response formats
        const coursesList = Array.isArray(data) ? data : data.courses || data.data || [];
        setCourses(coursesList);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch courses:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2d3f5e] border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading courses from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-500/10 p-8 rounded-2xl border border-red-500/30">
          <p className="text-red-400 text-xl mb-4">Error: {error}</p>
          <p className="text-gray-300 mb-4">Make sure your backend server is running on port 7777</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">No courses found in database</p>
          <Link to="/" className="text-blue-400 hover:text-blue-300">Refresh</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to LearnHub</h1>
        <p className="text-xl text-gray-300">Choose a course to start learning</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => {
          // Get the correct ID (MongoDB uses _id)
          const courseId = course._id || course.id;
          
          return (
            <Link
              key={courseId}
              to={`/course/${courseId}`}
              className="group bg-gradient-to-br from-[#1e2f4a] to-[#2d3f5e] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1929] to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                    {course.level || "Beginner"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {course.description || "Learn the fundamentals and advance your skills"}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <BookOpen size={16} />
                    <span>{course.videoCount || course.videos?.length || 0} Lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{course.duration || "8 hours"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{course.students || "1.2k"}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">
                      {course.price ? `$${course.price}` : "Free"}
                    </span>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      <PlayCircle size={18} />
                      Start Course
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;