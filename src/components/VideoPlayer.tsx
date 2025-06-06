import React, { useCallback, useEffect, useState } from 'react';

const formatTime = (t: number) =>
  `${Math.floor(t / 60)}:${Math.floor(t % 60)
    .toString()
    .padStart(2, '0')}`;

interface VideoPlayerProps {
  url: string | null;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  
  const scrubberTime = duration > 0 ? currentTime / duration : 0;
  const currentPercent = scrubberTime * 100;

  const togglePlay = useCallback(() => {
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  }, [isPlaying, video]);

  const updateDuration = () => {
    if (video) setDuration(video.duration);
  };

  const updateTime = () => {
    if (video && !isScrubbing) {
      setCurrentTime(video.currentTime);
    }
  };

  const onPlay = () => setIsPlaying(true);
  const onPause = () => setIsPlaying(false);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    if (video && url) {
      video.load();
    }
  }, [url, video]);

  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLElement &&
        e.target.tagName !== 'INPUT' &&
        e.target.tagName !== 'TEXTAREA' &&
        e.key === ' '
      ) {
        e.preventDefault();
        togglePlay();
      }
    };

    document.addEventListener('keypress', onKeyPress);
    return () => {
      document.removeEventListener('keypress', onKeyPress);
    };
  }, [togglePlay]);

  if (!url) {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Video will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <div className="aspect-video">
        <video
          src={url}
          ref={setVideo}
          onClick={togglePlay}
          onLoadedMetadata={updateDuration}
          onTimeUpdate={updateTime}
          onPlay={onPlay}
          onPause={onPause}
          controls={false}
          preload="auto"
          crossOrigin="anonymous"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="bg-gray-900 p-4">
        <div className="mb-3">
          <input
            style={{'--pct': `${currentPercent}%`} as React.CSSProperties}
            type="range"
            min="0"
            max={duration > 0 ? duration : 1}
            value={currentTime}
            step="0.01"
            onChange={(e) => {
              if (!video) return;
              const newTime = e.target.valueAsNumber;
              setCurrentTime(newTime);
              video.currentTime = newTime;
            }}
            onPointerDown={() => setIsScrubbing(true)}
            onPointerUp={() => setIsScrubbing(false)}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            aria-label="Video progress"
          />
        </div>
        
        <div className="flex items-center justify-between text-white">
          <button 
            onClick={togglePlay} 
            className="flex items-center justify-center w-10 h-10 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            <span className="material-symbols-outlined text-lg">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
          
          <span className="text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};