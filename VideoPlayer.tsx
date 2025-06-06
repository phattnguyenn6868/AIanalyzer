/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
// Copyright 2024 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {useCallback, useEffect, useState} from 'react';

const formatTime = (t: number) =>
  `${Math.floor(t / 60)}:${Math.floor(t % 60)
    .toString()
    .padStart(2, '0')}`;

interface VideoPlayerProps {
  url: string | null;
}

export default function VideoPlayer({ url }: VideoPlayerProps) {
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
      video.load(); // Ensure video reloads if URL changes
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
        e.preventDefault(); // Prevent space bar from scrolling page
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
      <div className="emptyVideo">
         <p>Video will appear here.</p>
      </div>
    );
  }

  return (
    <div className="videoPlayer">
      <div>
        <video
          src={url}
          ref={setVideo}
          onClick={togglePlay}
          onLoadedMetadata={updateDuration} // Use onLoadedMetadata for duration
          onTimeUpdate={updateTime}
          onPlay={onPlay}
          onPause={onPause}
          controls={false} // Disable native controls, we use custom
          preload="auto"
          crossOrigin="anonymous"
        />
      </div>

      <div className="videoControls">
        <div className="videoScrubber">
          <input
            style={{'--pct': `${currentPercent}%`} as React.CSSProperties}
            type="range"
            min="0"
            max={duration > 0 ? duration : 1} // Max should be duration
            value={currentTime}
            step="0.01" // Finer step
            onChange={(e) => {
              if (!video) return;
              const newTime = e.target.valueAsNumber;
              setCurrentTime(newTime);
              video.currentTime = newTime;
            }}
            onPointerDown={() => setIsScrubbing(true)}
            onPointerUp={() => setIsScrubbing(false)}
            aria-label="Video progress"
          />
        </div>
        <div className="videoTime">
          <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
            <span className="icon">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
          <span>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}