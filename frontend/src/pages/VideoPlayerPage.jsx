import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useRealtimeSpeed from "../hooks/useRealtimeSpeed";
import { ChevronLeft, List, Maximize, Minimize, PlayCircle, Settings, Share2, Info } from "lucide-react";

const VideoPlayerPage = () => {
  const { courseId, videoId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [quality, setQuality] = useState("Auto");
  const [currentTime, setCurrentTime] = useState(0);
  const [videoData, setVideoData] = useState(null);
  const [courseVideos, setCourseVideos] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const speed = useRealtimeSpeed(3000);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        const videoResponse = await fetch(`http://localhost:7777/api/videos/course/${courseId}/${videoId}`);
        if (!videoResponse.ok) throw new Error(`Failed to fetch video: ${videoResponse.status}`);
        const videoData = await videoResponse.json();
        setVideoData(videoData);

        const videosResponse = await fetch(`http://localhost:7777/api/videos/course/${courseId}`);
        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          setCourseVideos(Array.isArray(videosData) ? videosData : []);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching video:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (courseId && videoId) fetchVideoData();
    else {
      setError("Invalid course or video ID");
      setLoading(false);
    }
  }, [courseId, videoId]);

  useEffect(() => {
    if (videoRef.current && videoData) {
      const wasPlaying = !videoRef.current.paused;
      videoRef.current.currentTime = currentTime;
      if (wasPlaying) videoRef.current.play().catch(e => console.log("Playback error:", e));
    }
  }, [quality]);

  useEffect(() => {
    if (!videoData || quality !== "Auto") return;
    if (speed < 1) setQuality("240p");
    else if (speed < 3) setQuality("360p");
    else setQuality("720p");
  }, [speed, videoData]);

  const handleQualityChange = (e) => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
    setQuality(e.target.value);
  };

  const handleVideoSelect = (selectedVideoId) => {
    navigate(`/video/${courseId}/${selectedVideoId}`);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="glass p-10 rounded-[2.5rem] text-center max-w-md">
          <p className="text-red-400 text-xl mb-6">{error || "Video not found"}</p>
          <Link to={`/course/${courseId}`} className="inline-block px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  const VIDEO_SOURCES = {
    "240p": videoData.resolutions?.p240 || videoData.url,
    "360p": videoData.resolutions?.p360 || videoData.url,
    "720p": videoData.resolutions?.p720 || videoData.url,
  };

  const currentVideoUrl = VIDEO_SOURCES[quality] || videoData.url;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation Bar */}
      <nav className="glass border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-[1920px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to={`/course/${courseId}`}
            className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all"
          >
            <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-purple-500/30 group-hover:bg-purple-500/10">
              <ChevronLeft size={20} className="group-hover:text-purple-400" />
            </div>
            <span className="font-bold tracking-tight">Return to Curriculum</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Stream Optimal</span>
            </div>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all shadow-lg shadow-purple-500/20"
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1920px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Video Section */}
          <div className="flex-1 min-w-0">
            <div className="glass rounded-[3rem] overflow-hidden border-white/10 relative shadow-2xl">
              <div className="aspect-video bg-black relative group">
                <video
                  ref={videoRef}
                  src={currentVideoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-10">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
                      {videoData.title || "Untitled Lesson"}
                    </h1>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Info size={16} />
                        <span className="text-sm font-medium">Resolution: {quality === "Auto" ? "Adaptive" : quality}</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Share2 size={16} />
                        <span className="text-sm font-medium">Lesson Resources</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 self-start">
                    <div className="flex items-center gap-3 px-4 py-2 bg-[#0a0a0a] rounded-xl border border-white/5">
                      <Settings size={18} className="text-purple-500" />
                      <select
                        value={quality}
                        onChange={handleQualityChange}
                        className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="Auto">Auto-Select</option>
                        <option value="240p">Low (240p)</option>
                        <option value="360p">Med (360p)</option>
                        <option value="720p">High (720p)</option>
                      </select>
                    </div>
                    <button
                      onClick={toggleFullscreen}
                      className="p-3 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
                    >
                      {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
                    </button>
                  </div>
                </div>

                <div className="glass p-8 rounded-[2rem] border-white/5">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                    About this lesson
                  </h3>
                  <div className="space-y-6">
                    <p className="text-gray-400 leading-relaxed text-lg">
                      {videoData.textContent || "No lesson description available. Focus on the core architectural implementation discussed in the video."}
                    </p>

                    {videoData.attachments && videoData.attachments.length > 0 && (
                      <div className="pt-6 border-t border-white/5">
                        <h4 className="text-sm font-black uppercase tracking-widest text-purple-400 mb-4">Downloadable Notes</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {videoData.attachments.map((attachment, idx) => (
                            <a
                              key={idx}
                              href={attachment.downloadUrl || attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group"
                            >
                              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                                📄
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-200 truncate">{attachment.fileName || `Note ${idx + 1}`}</p>
                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-tighter">PDF DOCUMENT</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Speed Meter */}
                <div className="mt-8 flex items-center gap-4 bg-purple-500/5 p-6 rounded-[2rem] border border-purple-500/10">
                  <div className="flex-grow">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-400 mb-3">Live Bandwidth Statistics</p>
                    <div className="h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 via-purple-400 to-white rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((speed / 10) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black">{speed || "0.0"} <span className="text-sm text-gray-500 uppercase">Mbps</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Sidebar (Playlist) */}
          <aside className={`lg:w-[400px] shrink-0 ${showSidebar ? 'fixed inset-0 z-50 bg-[#0a0a0a] p-6 lg:static' : 'hidden lg:block'}`}>
            <div className="lg:sticky lg:top-32">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  Content
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30">
                    {courseVideos.length} units
                  </span>
                </h3>
                {showSidebar && (
                  <button onClick={() => setShowSidebar(false)} className="p-2 bg-white/5 rounded-full">
                    ×
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar pr-2">
                {courseVideos.map((video, index) => {
                  const vidId = video._id || video.id;
                  const isCurrentVideo = vidId === videoId;

                  return (
                    <button
                      key={vidId || index}
                      onClick={() => vidId && handleVideoSelect(vidId)}
                      className={`w-full text-left p-6 rounded-3xl transition-all duration-500 group relative overflow-hidden ${isCurrentVideo
                        ? 'glass border-purple-500/40 bg-purple-500/5'
                        : 'bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/[0.08]'
                        }`}
                    >
                      {isCurrentVideo && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-purple-500 rounded-r-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                      )}

                      <div className="flex items-center gap-5 relative z-10">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border ${isCurrentVideo
                          ? 'bg-purple-600 border-purple-400 text-white'
                          : 'bg-black border-white/5 text-gray-500 group-hover:border-purple-500/30 group-hover:text-purple-400'
                          }`}>
                          <PlayCircle size={20} className={isCurrentVideo ? "animate-pulse" : ""} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-black uppercase tracking-widest mb-1 ${isCurrentVideo ? 'text-purple-400' : 'text-gray-500'
                            }`}>
                            Lesson {index + 1}
                          </p>
                          <h4 className={`font-bold truncate text-lg transition-colors ${isCurrentVideo ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                            }`}>
                            {video.title || "Untitled Unit"}
                          </h4>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default VideoPlayerPage;
