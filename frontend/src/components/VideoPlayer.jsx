import { useEffect, useRef, useState } from "react";
import useRealtimeSpeed from "./useRealtimeSpeed";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [quality, setQuality] = useState("Auto");
  const [currentTime, setCurrentTime] = useState(0);
  const [videoData, setVideoData] = useState(null);
  const speed = useRealtimeSpeed(3000);

  useEffect(() => {
    fetch("http://localhost:7777/api/videos/course/698f744c4c54558c193828d8/698f74a54c54558c193828da")
      .then(res => res.json())
      .then(data => setVideoData(data));
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;
      videoRef.current.play();
    }
  }, [quality]);

  useEffect(() => {
    if (!videoData || quality !== "Auto") return;

    if (speed < 1) setQuality("240p");
    else if (speed < 3) setQuality("360p");
    else setQuality("720p");
  }, [speed, videoData]);

  const handleQualityChange = (e) => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
    setQuality(e.target.value);
  };

  if (!videoData) return (
    <div className="min-h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-[#0a1929] to-[#1e2f4a] rounded-2xl text-gray-100 font-sans">
      <div className="w-12 h-12 border-4 border-[#2d3f5e] border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-200">Loading video...</p>
    </div>
  );

  const VIDEO_SOURCES = {
    "240p": videoData.resolutions.p240,
    "360p": videoData.resolutions.p360,
    "720p": videoData.resolutions.p720,
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-[#0a1929] to-[#1e2f4a] rounded-2xl shadow-2xl font-sans">
      <div className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-[#0a1929] border-2 border-gray-700">
        <video
          ref={videoRef}
          src={VIDEO_SOURCES[quality]}
          controls
          className="w-full aspect-video bg-black [&::-webkit-media-controls-panel]:bg-gradient-to-t [&::-webkit-media-controls-panel]:from-[#0a1929]/95 [&::-webkit-media-controls-panel]:to-[#0a1929]/70 [&::-webkit-media-controls-play-button]:brightness-0 [&::-webkit-media-controls-play-button]:invert [&::-webkit-media-controls-mute-button]:brightness-0 [&::-webkit-media-controls-mute-button]:invert [&::-webkit-media-controls-current-time-display]:text-white [&::-webkit-media-controls-time-remaining-display]:text-white [&::-webkit-media-controls-timeline]:bg-white/20 [&::-webkit-media-controls-timeline]:h-1.5 [&::-webkit-media-controls-timeline]:rounded [&::-webkit-media-controls-timeline::-webkit-slider-thumb]:bg-blue-500"
        />
      </div>

      <div className="mt-6 p-6 bg-gradient-to-r from-[#1e2f4a] to-[#2d3f5e] rounded-xl shadow-lg border border-gray-700 flex flex-wrap gap-6 items-start">
        <div className="flex-1 min-w-[250px]">
          <label htmlFor="quality-select" className="block mb-2 text-sm font-medium text-gray-200 uppercase tracking-wide">
            Quality:
          </label>
          <select
            id="quality-select"
            value={quality}
            onChange={handleQualityChange}
            className="w-full px-4 py-3 bg-[#0a1929] text-white border-2 border-gray-700 rounded-xl text-sm font-medium cursor-pointer transition-all appearance-none bg-no-repeat bg-right-4 bg-[length:16px] hover:border-blue-500 hover:bg-[#1e2f4a] hover:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.2)]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundPosition: 'right 1rem center'
            }}
          >
            <option value="Auto" className="bg-[#0a1929] text-white">Auto (Recommended)</option>
            <option value="240p" className="bg-[#0a1929] text-white">240p (Low)</option>
            <option value="360p" className="bg-[#0a1929] text-white">360p (Medium)</option>
            <option value="720p" className="bg-[#0a1929] text-white">720p (High)</option>
          </select>
        </div>

        <div className="flex-1 min-w-[250px]">
          <div className="w-full h-2 bg-[#0a1929] rounded-full overflow-hidden mb-3 border border-gray-700">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((speed / 5) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="flex flex-col">
            {speed ? (
              <>
                <span className="text-3xl font-bold text-white leading-tight tracking-tight">
                  {speed} <span className="text-sm font-normal text-gray-400 ml-1">Mbps</span>
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-wide">Current Speed</span>
              </>
            ) : (
              <span className="text-sm text-gray-400">Testing connection speed...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;