import { useState, useEffect } from 'react';

const useRealtimeSpeed = (interval = 3000) => {
  const [speed, setSpeed] = useState(null);

  useEffect(() => {
    let mounted = true;
    let timeoutId;

    const testSpeed = async () => {
      try {
        const startTime = performance.now();
        const response = await fetch(
          'https://res.cloudinary.com/demo/image/upload/sample.jpg',
          { cache: 'no-store' }
        );
        const blob = await response.blob();
        const endTime = performance.now();
        
        const sizeInBits = blob.size * 8;
        const durationInSeconds = (endTime - startTime) / 1000;
        const speedMbps = (sizeInBits / durationInSeconds) / (1024 * 1024);
        
        if (mounted) {
          setSpeed(speedMbps.toFixed(2));
        }
      } catch (error) {
        console.error('Speed test failed:', error);
        if (mounted) {
          setSpeed(null);
        }
      }
    };

    testSpeed();
    const intervalId = setInterval(testSpeed, interval);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [interval]);

  return speed;
};

export default useRealtimeSpeed;