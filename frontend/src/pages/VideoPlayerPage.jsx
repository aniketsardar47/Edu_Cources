import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useRealtimeSpeed from "../hooks/useRealtimeSpeed";
import { ChevronLeft, List, Maximize, Minimize, PlayCircle } from "lucide-react";

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
    // Log the received data
    console.log("VideoPlayerPage mounted with:", { courseId, videoId });

    const fetchVideoData = async () => {
      try {
        setLoading(true);
        
        // Fetch current video
        const videoResponse = await fetch(
          `http://localhost:7777/api/videos/course/${courseId}/${videoId}`
        );
        
        if (!videoResponse.ok) {
          throw new Error(`Failed to fetch video: ${videoResponse.status}`);
        }
        
        const videoData = await videoResponse.json();
        console.log("Video data received:", videoData);
        setVideoData(videoData);

        // Fetch all videos for this course
        const videosResponse = await fetch(
          `http://localhost:7777/api/videos/course/${courseId}`
        );
        
        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          console.log("Course videos received:", videosData);
          setCourseVideos(Array.isArray(videosData) ? videosData : []);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching video:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (courseId && videoId) {
      fetchVideoData();
    } else {
      setError("Invalid course or video ID");
      setLoading(false);
    }
  }, [courseId, videoId]);

  // Handle quality change
  useEffect(() => {
    if (videoRef.current && videoData) {
      const wasPlaying = !videoRef.current.paused;
      videoRef.current.currentTime = currentTime;
      if (wasPlaying) {
        videoRef.current.play().catch(e => console.log("Playback error:", e));
      }
    }
  }, [quality]);

  // Auto quality adjustment based on speed
  useEffect(() => {
    if (!videoData || quality !== "Auto") return;

    if (speed < 1) {
      setQuality("240p");
    } else if (speed < 3) {
      setQuality("360p");
    } else {
      setQuality("720p");
    }
  }, [speed, videoData]);

  const handleQualityChange = (e) => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1929] to-[#1e2f4a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2d3f5e] border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading video...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !videoData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1929] to-[#1e2f4a] flex items-center justify-center">
        <div className="bg-[#1e2f4a] p-8 rounded-2xl border border-red-500/30 max-w-md text-center">
          <p className="text-red-400 text-xl mb-4">⚠️ Error</p>
          <p className="text-white mb-4">{error || "Video not found"}</p>
          <Link 
            to={`/course/${courseId}`}
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  // Get video sources from the response
  const VIDEO_SOURCES = {
    "240p": videoData.resolutions?.p240 || videoData.url,
    "360p": videoData.resolutions?.p360 || videoData.url,
    "720p": videoData.resolutions?.p720 || videoData.url,
  };

  const currentVideoUrl = VIDEO_SOURCES[quality] || videoData.url;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1929] to-[#1e2f4a]">
      {/* Navigation Bar */}
      <div className="bg-[#1e2f4a] border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            to={`/course/${courseId}`}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back to Course</span>
          </Link>
          
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 bg-[#0a1929] text-white rounded-lg hover:bg-[#2d3f5e]"
          >
            <List size={20} />
            <span>Videos</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Video Player */}
          <div className="flex-1">
            <div className="bg-[#0a1929] rounded-2xl overflow-hidden border border-gray-700">
              <div className="relative">
                <video
                  ref={videoRef}
                  src={currentVideoUrl}
                  controls
                  autoPlay
                  className="w-full aspect-video bg-black"
                  onError={(e) => {
                    console.error("Video playback error:", e);
                    console.error("Failed URL:", currentVideoUrl);
                  }}
                />
                
                {/* Video Info */}
                <div className="p-4 bg-[#1e2f4a] border-t border-gray-700">
                  <h1 className="text-xl font-bold text-white mb-2">
                    {videoData.title || "Untitled Video"}
                  </h1>
                  <p className="text-gray-300 text-sm">
                    {videoData.textContent || "No description available"}
                  </p>
                </div>

                {/* Controls */}
                <div className="p-4 bg-[#1e2f4a] border-t border-gray-700">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Quality Selector */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-300">Quality:</label>
                      <select
                        value={quality}
                        onChange={handleQualityChange}
                        className="px-3 py-2 bg-[#0a1929] text-white border border-gray-700 rounded-lg text-sm cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500"
                      >
                        <option value="Auto">Auto</option>
                        <option value="240p">240p</option>
                        <option value="360p">360p</option>
                        <option value="720p">720p</option>
                      </select>
                    </div>

                    {/* Fullscreen Button */}
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 bg-[#0a1929] text-gray-300 rounded-lg hover:text-white hover:bg-[#2d3f5e]"
                    >
                      {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                    </button>

                    {/* Speed Meter */}
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-[#0a1929] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((speed / 5) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-300 whitespace-nowrap">
                          {speed ? `${speed} Mbps` : "Testing..."}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Sidebar */}
          <div className={`lg:w-80 ${showSidebar ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-[#1e2f4a] rounded-2xl p-4 border border-gray-700 sticky top-20">
              <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                Course Videos ({courseVideos.length})
              </h3>
              
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {courseVideos.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No other videos</p>
                ) : (
                  courseVideos.map((video, index) => {
                    const vidId = video._id || video.id;
                    const isCurrentVideo = vidId === videoId;
                    
                    return (
                      <button
                        key={vidId || index}
                        onClick={() => vidId && handleVideoSelect(vidId)}
                        className={`w-full text-left p-3 rounded-xl transition-all ${
                          isCurrentVideo
                            ? 'bg-blue-500/20 border border-blue-500'
                            : 'bg-[#0a1929] hover:bg-[#2d3f5e] border border-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                            isCurrentVideo ? 'bg-blue-500' : 'bg-gray-700'
                          }`}>
                            <PlayCircle size={16} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${
                              isCurrentVideo ? 'text-blue-400' : 'text-gray-300'
                            }`}>
                              Lesson {index + 1}
                            </p>
                            <p className={`text-sm truncate ${
                              isCurrentVideo ? 'text-white' : 'text-gray-400'
                            }`}>
                              {video.title || `Video ${index + 1}`}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;