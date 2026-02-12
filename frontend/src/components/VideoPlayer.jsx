import { useEffect, useRef, useState } from "react";
import useRealtimeSpeed from "./useRealtimeSpeed";

const VIDEO_SOURCES = {
  "240p":
    "https://res.cloudinary.com/dzdgexvxu/video/upload/c_scale,h_240,w_426/v1/learning_app/videos/nqwwjypa40x0s35ngyn9?_a=BAMAOGce0",
  
  "360p":
    "https://res.cloudinary.com/dzdgexvxu/video/upload/c_scale,h_360,w_640/v1/learning_app/videos/nqwwjypa40x0s35ngyn9?_a=BAMAOGce0",

  "720p":
    "https://res.cloudinary.com/dzdgexvxu/video/upload/c_scale,h_720,w_1280/v1/learning_app/videos/nqwwjypa40x0s35ngyn9?_a=BAMAOGce0",
};

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [quality, setQuality] = useState("720p");
  const [currentTime, setCurrentTime] = useState(0);
  const speed = useRealtimeSpeed(3000);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;
      videoRef.current.play();
    }
  }, [quality]);

  const handleQualityChange = (e) => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
    setQuality(e.target.value);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <video
        ref={videoRef}
        src={VIDEO_SOURCES[quality]}
        controls
        preload="metadata"
        playsInline
        style={{ width: "100%", borderRadius: "8px" }}
      />

      <div style={{ marginTop: "10px" }}>
        <label>Quality: </label>
        <select value={quality} onChange={handleQualityChange}>
          <option value="240p">240p</option>
          <option value="360p">360p</option>
          <option value="720p">720p (HD)</option>
          <option value="Auto">Auto</option>
        </select>

          <p>
        Network Speed:{" "}
        <strong>{speed ? `${speed} Mbps` : "Testing..."}</strong>
      </p>
      </div>
    </div>
  );
};

export default VideoPlayer;
