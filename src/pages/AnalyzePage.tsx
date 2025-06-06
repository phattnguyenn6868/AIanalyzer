import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft, Play, FileVideo, CheckCircle, AlertCircle } from 'lucide-react';
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
  const [dragActive, setDragActive] = useState(false);

  if (!user) {
    navigate('/');
    return null;
  }

  const canUpload = user.uploadsUsed < user.uploadsLimit;
  const remainingUploads = user.uploadsLimit - user.uploadsUsed;

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('video/')) {
      return 'Please select a video file.';
    }
    
    // Check file size (3 minutes ≈ 50MB for typical video)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return 'Video file is too large. Please select a video under 100MB.';
    }
    
    return null;
  };

  const handleFileSelect = (file: File) => {
    const error = validateFile(file);
    if (error) {
      alert(error);
      return;
    }
    
    setSelectedFile(file);
    setVideoUrl(URL.createObjectURL(file));
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
    setDragActive(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mr-4 text-gray-300 hover:text-white"
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
          <Card className="mb-8 border-red-500/50 bg-red-900/20">
            <div className="text-center p-6">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-400 mb-2">
                Upload Limit Reached
              </h3>
              <p className="text-gray-400 mb-4">
                You've used all {user.uploadsLimit} uploads for your {user.plan} plan.
              </p>
              {user.plan === 'free' && (
                <Button onClick={() => navigate('/dashboard')} className="bg-red-600 hover:bg-red-700">
                  Upgrade to Pro
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Upload Area */}
        {canUpload && (
          <Card className="mb-8 bg-gray-900/50 border-gray-800">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
                dragActive 
                  ? 'border-red-500 bg-red-500/10' 
                  : selectedFile 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-gray-700 hover:border-red-500 hover:bg-red-500/5'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {!selectedFile ? (
                <>
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Upload Your Training Video
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Drag and drop your video file here, or click to browse
                  </p>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <FileVideo className="w-5 h-5 mr-2" />
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
                    Supported formats: MP4, MOV, AVI, WebM (Max 3 minutes, 100MB)
                  </p>
                </>
              ) : (
                <div>
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="aspect-video bg-gray-800 rounded-lg mb-6 flex items-center justify-center max-w-md mx-auto overflow-hidden">
                    {videoUrl ? (
                      <video 
                        src={videoUrl} 
                        className="w-full h-full object-cover rounded-lg"
                        controls
                        preload="metadata"
                      />
                    ) : (
                      <Play className="w-12 h-12 text-gray-600" />
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {selectedFile.name}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    File size: {formatFileSize(selectedFile.size)}
                  </p>
                  
                  {isUploading ? (
                    <div className="space-y-4">
                      <div className="bg-gray-800 rounded-full h-3 max-w-md mx-auto overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-red-600 to-red-500 h-3 rounded-full transition-all duration-300"
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
                        className="border-gray-600 hover:border-gray-500"
                      >
                        Choose Different File
                      </Button>
                      <Button 
                        onClick={handleUpload}
                        className="bg-red-600 hover:bg-red-700"
                      >
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
        <Card className="bg-gray-900/50 border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Upload Usage
              </h3>
              <p className="text-gray-400">
                {user.uploadsUsed} of {user.uploadsLimit} uploads used this {user.plan === 'free' ? 'trial' : 'month'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                {remainingUploads}
              </div>
              <div className="text-gray-400 text-sm">remaining</div>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-800 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                (user.uploadsUsed / user.uploadsLimit) > 0.8 
                  ? 'bg-red-500' 
                  : (user.uploadsUsed / user.uploadsLimit) > 0.6 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
              }`}
              style={{ width: `${(user.uploadsUsed / user.uploadsLimit) * 100}%` }}
            />
          </div>
          
          {user.plan === 'free' && remainingUploads <= 2 && (
            <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm">
                <strong>Running low on uploads!</strong> Upgrade to Pro for 60 analyses per month.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};