import { useEffect, useState } from "react";

const useRealtimeSpeed = (interval = 5000) => {
  const [speed, setSpeed] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const testSpeed = async () => {
      const fileUrl =
        "https://res.cloudinary.com/demo/image/upload/sample.jpg"; // small static file

      const startTime = performance.now();

      try {
        const response = await fetch(fileUrl, {
          cache: "no-store",
        });

        const blob = await response.blob();
        const endTime = performance.now();

        const sizeInBits = blob.size * 8;
        const timeInSeconds = (endTime - startTime) / 1000;

        const speedMbps = (sizeInBits / timeInSeconds) / (1024 * 1024);

        if (!isCancelled) {
          setSpeed(speedMbps.toFixed(2));
        }
      } catch (err) {
        console.error("Speed test failed", err);
      }
    };

    testSpeed();
    const intervalId = setInterval(testSpeed, interval);

    return () => {
      isCancelled = true;
      clearInterval(intervalId);
    };
  }, [interval]);

  return speed;
};

export default useRealtimeSpeed;