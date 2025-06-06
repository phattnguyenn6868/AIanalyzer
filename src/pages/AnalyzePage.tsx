import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useVideo } from '../contexts/VideoContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { VideoAnalysis } from '../types';

export const AnalyzePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { addVideo } = useVideo();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!user) {
    navigate('/');
    return null;
  }

  const canUpload = user.uploadsUsed < user.uploadsLimit;

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('video/')) {
      setSelectedFile(file);
      setVideoUrl(URL.createObjectURL(file));
    } else {
      alert('Please select a video file.');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleUpload = async () => {
    if (!selectedFile || !canUpload) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Create video analysis record
      const videoAnalysis: VideoAnalysis = {
        id: Date.now().toString(),
        userId: user.id,
        title: selectedFile.name.replace(/\.[^/.]+$/, ''),
        videoUrl: videoUrl!,
        status: 'processing',
        createdAt: new Date(),
      };

      addVideo(videoAnalysis);
      
      // Update user's upload count
      updateUser({
        uploadsUsed: user.uploadsUsed + 1,
      });

      // Navigate to analysis page
      navigate(`/analysis/${videoAnalysis.id}`);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Upload Training Video</h1>
            <p className="text-gray-400">
              Upload your boxing training or sparring video for AI analysis
            </p>
          </div>
        </div>

        {/* Usage Warning */}
        {!canUpload && (
          <Card className="mb-8 border-red-500">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-red-400 mb-2">
                Upload Limit Reached
              </h3>
              <p className="text-gray-400 mb-4">
                You've used all {user.uploadsLimit} uploads for your {user.plan} plan.
              </p>
              {user.plan === 'free' && (
                <Button onClick={() => navigate('/dashboard')}>
                  Upgrade to Pro
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Upload Area */}
        {canUpload && (
          <Card className="mb-8">
            <div
              className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center hover:border-red-500 transition-colors duration-200"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {!selectedFile ? (
                <>
                  <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Upload Your Training Video
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Drag and drop your video file here, or click to browse
                  </p>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-gray-500 text-sm mt-4">
                    Supported formats: MP4, MOV, AVI (Max 3 minutes)
                  </p>
                </>
              ) : (
                <div>
                  <div className="aspect-video bg-gray-800 rounded-lg mb-4 flex items-center justify-center max-w-md mx-auto">
                    {videoUrl ? (
                      <video 
                        src={videoUrl} 
                        className="w-full h-full object-cover rounded-lg"
                        controls
                      />
                    ) : (
                      <Play className="w-12 h-12 text-gray-600" />
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {selectedFile.name}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    File size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  
                  {isUploading ? (
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-full h-2 max-w-md mx-auto">
                        <div 
                          className="bg-red-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-gray-400">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  ) : (
                    <div className="flex space-x-4 justify-center">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedFile(null);
                          setVideoUrl(null);
                        }}
                      >
                        Choose Different File
                      </Button>
                      <Button onClick={handleUpload}>
                        Start Analysis
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Usage Stats */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Upload Usage
              </h3>
              <p className="text-gray-400">
                {user.uploadsUsed} of {user.uploadsLimit} uploads used
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {user.uploadsLimit - user.uploadsUsed}
              </div>
              <div className="text-gray-400 text-sm">remaining</div>
            </div>
          </div>
          
          <div className="mt-4 bg-gray-800 rounded-full h-2">
            <div 
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(user.uploadsUsed / user.uploadsLimit) * 100}%` }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};