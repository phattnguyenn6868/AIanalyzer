import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VideoAnalysis } from '../types';

interface VideoContextType {
  videos: VideoAnalysis[];
  addVideo: (video: VideoAnalysis) => void;
  updateVideo: (id: string, updates: Partial<VideoAnalysis>) => void;
  getVideo: (id: string) => VideoAnalysis | undefined;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};

interface VideoProviderProps {
  children: ReactNode;
}

export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
  const [videos, setVideos] = useState<VideoAnalysis[]>([]);

  const addVideo = (video: VideoAnalysis) => {
    setVideos(prev => [video, ...prev]);
  };

  const updateVideo = (id: string, updates: Partial<VideoAnalysis>) => {
    setVideos(prev => prev.map(video => 
      video.id === id ? { ...video, ...updates } : video
    ));
  };

  const getVideo = (id: string) => {
    return videos.find(video => video.id === id);
  };

  const value = {
    videos,
    addVideo,
    updateVideo,
    getVideo,
  };

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
};