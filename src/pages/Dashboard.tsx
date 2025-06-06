import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Play, Calendar, TrendingUp, Crown, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useVideo } from '../contexts/VideoContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { videos } = useVideo();
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please log in to access your dashboard</h1>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const canUpload = user.uploadsUsed < user.uploadsLimit;
  const usagePercentage = (user.uploadsUsed / user.uploadsLimit) * 100;

  const handleUpgrade = () => {
    // Simulate upgrade to Pro
    updateUser({
      plan: 'pro',
      uploadsLimit: 60,
      subscriptionStatus: 'active',
    });
    setShowUpgrade(false);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-400">
            Analyze your training videos and track your progress.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Plan Status */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Current Plan</p>
                <p className="text-2xl font-bold text-white capitalize flex items-center">
                  {user.plan}
                  {user.plan === 'pro' && <Crown className="w-5 h-5 text-yellow-500 ml-2" />}
                </p>
              </div>
              {user.plan === 'free' && (
                <Button size="sm" onClick={() => setShowUpgrade(true)}>
                  Upgrade
                </Button>
              )}
            </div>
          </Card>

          {/* Usage Stats */}
          <Card>
            <div>
              <p className="text-gray-400 text-sm">Uploads Used</p>
              <p className="text-2xl font-bold text-white">
                {user.uploadsUsed}/{user.uploadsLimit}
              </p>
              <div className="mt-2 bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Total Analyses */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Analyses</p>
                <p className="text-2xl font-bold text-white">{videos.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-500" />
            </div>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <div className="text-center py-8">
            <Upload className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Upload New Training Video
            </h3>
            <p className="text-gray-400 mb-6">
              Get AI-powered analysis of your boxing technique
            </p>
            
            {canUpload ? (
              <Link to="/analyze">
                <Button size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Upload Video
                </Button>
              </Link>
            ) : (
              <div className="space-y-4">
                <p className="text-red-400 font-medium">
                  You've reached your upload limit for this {user.plan === 'free' ? 'trial' : 'month'}.
                </p>
                {user.plan === 'free' && (
                  <Button onClick={() => setShowUpgrade(true)}>
                    Upgrade to Pro
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Recent Analyses */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Recent Analyses</h2>
          
          {videos.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No analyses yet
                </h3>
                <p className="text-gray-500">
                  Upload your first training video to get started.
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card key={video.id} hover>
                  <div className="aspect-video bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                    {video.thumbnailUrl ? (
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Play className="w-12 h-12 text-gray-600" />
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-white mb-2">{video.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {format(video.createdAt, 'MMM d, yyyy')}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      video.status === 'completed' 
                        ? 'bg-green-900 text-green-300'
                        : video.status === 'processing'
                        ? 'bg-yellow-900 text-yellow-300'
                        : 'bg-red-900 text-red-300'
                    }`}>
                      {video.status}
                    </span>
                    
                    {video.status === 'completed' && (
                      <Link to={`/analysis/${video.id}`}>
                        <Button size="sm" variant="outline">
                          View Analysis
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <Card className="max-w-md w-full mx-4">
            <div className="text-center">
              <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Upgrade to Pro</h3>
              <p className="text-gray-400 mb-6">
                Get 60 video analyses per month and advanced features.
              </p>
              
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-4xl font-bold text-white">$29</span>
                  <span className="text-gray-400">/month</span>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowUpgrade(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleUpgrade}
                  >
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};