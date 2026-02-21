import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Users, PlayCircle, Sparkles, Star, ArrowRight, Search } from "lucide-react";

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:7777/api/courses")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-purple-500/10 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6">
        <div className="glass p-10 rounded-3xl border-red-500/30 text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Connection Error</h2>
          <p className="text-gray-400 mb-8">Unable to reach the education servers. Please check if the backend is active.</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-300 tracking-wide uppercase">Next Generation Learning</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-tight">
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-600 to-white">
                Creative Future
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Explore professional-grade courses designed to elevate your skills. Learn from industry experts and join a community of 50,000+ students.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                Start Learning Now
              </button>
              <button className="px-8 py-4 glass hover:bg-white/10 text-white font-bold rounded-2xl transition-all">
                Browse Curriculum
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Available Courses</h2>
            <p className="text-gray-400">Curated learning paths for modern developers and designers.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search courses..."
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 focus:outline-none focus:border-purple-500/50 w-full md:w-80 transition-colors"
            />
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="glass p-20 rounded-3xl text-center border-dashed border-white/10">
            <p className="text-gray-500 text-xl">No courses available at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => {
              const courseId = course._id || course.id;
              return (
                <Link
                  key={courseId}
                  to={`/course/${courseId}`}
                  className="group glass rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-3 glass-hover animate-fade-in"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={course.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80"}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80"></div>
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-1 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold uppercase tracking-wider">
                        <Star className="w-3 h-3 text-purple-400 fill-purple-400" />
                        <span>{course.level || "Premium"}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-8">
                    <p className="text-gray-400 line-clamp-2 mb-8 leading-relaxed">
                      {course.description || "Master the concepts with architectural precision and industry-proven techniques."}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="flex flex-col gap-1">
                        <BookOpen className="w-5 h-5 text-purple-500" />
                        <span className="text-xs text-gray-500 font-medium">Lessons</span>
                        <span className="text-sm font-bold">{course.videoCount || course.videos?.length || 12}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Clock className="w-5 h-5 text-purple-500" />
                        <span className="text-xs text-gray-500 font-medium">Duration</span>
                        <span className="text-sm font-bold">{course.duration || "14h 30m"}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Users className="w-5 h-5 text-purple-500" />
                        <span className="text-xs text-gray-500 font-medium">Students</span>
                        <span className="text-sm font-bold">{course.students || "2.4k"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <span className="text-2xl font-black text-white">
                        {course.price ? `$${course.price}` : "FREE"}
                      </span>
                      <div className="flex items-center gap-2 text-purple-400 font-bold group-hover:translate-x-1 transition-transform">
                        Explore <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="px-6 py-32 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto glass p-12 md:p-24 rounded-[3rem] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to start your journey?</h2>
          <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">
            Join thousands of students and start building the future today.
          </p>
          <Link to="/admin" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-purple-100 transition-colors">
            Administrators Enter Here <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
