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

  if (!videoData) return <p>Loading video...</p>;

  const VIDEO_SOURCES = {
    "240p": videoData.resolutions.p240,
    "360p": videoData.resolutions.p360,
    "720p": videoData.resolutions.p720,
  };

  return (
    <div>
      <video
        ref={videoRef}
        src={VIDEO_SOURCES[quality]}
        controls
        style={{ width: "100%" }}
      />

      <select value={quality} onChange={handleQualityChange}>
        <option value="Auto">Auto</option>
        <option value="240p">240p</option>
        <option value="360p">360p</option>
        <option value="720p">720p</option>
      </select>

      <p>Speed: {speed ? `${speed} Mbps` : "Testing..."}</p>
    </div>
  );
};
export default VideoPlayer;
