import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PlayCircle, Clock, FileText, ChevronLeft, Star, ArrowRight } from "lucide-react";

const CoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId || courseId === "undefined") {
      setError("Invalid course ID");
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`http://localhost:7777/api/courses/${courseId}`).then(res => {
        if (!res.ok) throw new Error(`Course not found (${res.status})`);
        return res.json();
      }),
      fetch(`http://localhost:7777/api/videos/course/${courseId}`).then(res => {
        if (!res.ok) throw new Error(`Videos not found (${res.status})`);
        return res.json();
      })
    ])
      .then(([courseData, videosData]) => {
        setCourse(courseData);
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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6">
        <div className="glass p-10 rounded-[2rem] text-center max-w-md">
          <p className="text-red-400 text-xl mb-6">{error || "Course not found"}</p>
          <Link to="/" className="inline-block px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-400 mb-12 transition-all group"
        >
          <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-purple-500/30">
            <ChevronLeft size={20} />
          </div>
          <span className="font-semibold">Back to Catalog</span>
        </Link>

        {/* Course Header */}
        <div className="glass rounded-[3rem] overflow-hidden mb-16 relative">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row gap-12 p-8 md:p-12">
            <div className="lg:w-1/3">
              <div className="relative group">
                <img
                  src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
                  alt={course.title}
                  className="w-full h-64 lg:h-80 object-cover rounded-[2rem] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent rounded-[2rem]"></div>
              </div>
            </div>

            <div className="lg:w-2/3 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-purple-500/10 text-purple-400 text-xs font-black uppercase tracking-widest rounded-full border border-purple-500/20">
                  {course.level || "PREMIUM"}
                </span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm font-bold">4.9 (2.1k reviews)</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-3xl">
                {course.description || "Master the foundations and advanced concepts with our industry-led curriculum."}
              </p>

              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <FileText size={20} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Content</p>
                    <p className="font-bold">{videos.length} Lessons</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <Clock size={20} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Duration</p>
                    <p className="font-bold">{course.duration || "12h 45m"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video List */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Curriculum</h2>
            <span className="text-gray-500 font-medium">{videos.length} units to complete</span>
          </div>

          {videos.length === 0 ? (
            <div className="glass p-16 rounded-[2.5rem] text-center border-dashed">
              <p className="text-gray-500 text-lg italic">The curriculum is currently being finalized.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {videos.map((video, index) => {
                const videoId = video._id || video.id;
                return (
                  <Link
                    key={videoId}
                    to={`/video/${courseId}/${videoId}`}
                    className="group glass rounded-3xl p-6 flex flex-col md:flex-row md:items-center gap-6 transition-all duration-500 hover:-translate-y-1 hover:border-purple-500/30"
                  >
                    <div className="flex-shrink-0 w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                      <PlayCircle size={28} className="transition-transform group-hover:scale-110" />
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-black text-purple-500 uppercase tracking-widest">Unit {index + 1}</span>
                        <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                        <span className="text-xs text-gray-500 font-bold">{video.duration || "14:20"}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-1">{video.description}</p>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="px-6 py-3 bg-white/5 rounded-xl text-sm font-bold flex items-center gap-2 group-hover:bg-white group-hover:text-black transition-all">
                        Start <ArrowRight size={16} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
