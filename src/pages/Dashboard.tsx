import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Play, Calendar, TrendingUp, Crown, Plus, BarChart3, Clock, CheckCircle, AlertCircle } from 'lucide-react';
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
  const remainingUploads = user.uploadsLimit - user.uploadsUsed;

  const handleUpgrade = () => {
    // Simulate upgrade to Pro
    updateUser({
      plan: 'pro',
      uploadsLimit: 60,
      subscriptionStatus: 'active',
    });
    setShowUpgrade(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900/30 text-green-300 border-green-500/30';
      case 'processing':
        return 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30';
      case 'failed':
        return 'bg-red-900/30 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-900/30 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome back, <span className="text-red-500">{user.name}</span>!
          </h1>
          <p className="text-xl text-gray-400">
            Analyze your training videos and track your progress with AI-powered insights.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Plan Status */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Current Plan</p>
                <p className="text-3xl font-bold text-white capitalize flex items-center mt-2">
                  {user.plan}
                  {user.plan === 'pro' && <Crown className="w-6 h-6 text-yellow-500 ml-2" />}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {user.plan === 'free' ? 'Free Trial' : 'Professional Plan'}
                </p>
              </div>
              {user.plan === 'free' && (
                <Button size="sm" onClick={() => setShowUpgrade(true)} className="bg-red-600 hover:bg-red-700">
                  Upgrade
                </Button>
              )}
            </div>
          </Card>

          {/* Usage Stats */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <div>
              <p className="text-gray-400 text-sm font-medium">Uploads Used</p>
              <p className="text-3xl font-bold text-white mt-2">
                {user.uploadsUsed}<span className="text-gray-500">/{user.uploadsLimit}</span>
              </p>
              <div className="mt-4 bg-gray-800 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    usagePercentage > 80 ? 'bg-red-500' : usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
              <p className="text-gray-500 text-sm mt-2">
                {remainingUploads} uploads remaining
              </p>
            </div>
          </Card>

          {/* Total Analyses */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Analyses</p>
                <p className="text-3xl font-bold text-white mt-2">{videos.length}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Videos analyzed
                </p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-full">
                <BarChart3 className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="mb-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/25">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              Upload New Training Video
            </h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Get AI-powered analysis of your boxing technique. Upload videos up to 3 minutes long and receive detailed insights on your performance.
            </p>
            
            {canUpload ? (
              <div className="space-y-4">
                <Link to="/analyze">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 transform hover:scale-105 transition-all duration-200">
                    <Plus className="w-5 h-5 mr-2" />
                    Upload Video
                  </Button>
                </Link>
                <p className="text-gray-500 text-sm">
                  {remainingUploads} upload{remainingUploads !== 1 ? 's' : ''} remaining on your {user.plan} plan
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-400 font-medium mb-2">
                    Upload Limit Reached
                  </p>
                  <p className="text-gray-400 text-sm">
                    You've used all {user.uploadsLimit} uploads for your {user.plan === 'free' ? 'trial' : 'monthly'} plan.
                  </p>
                </div>
                {user.plan === 'free' && (
                  <Button onClick={() => setShowUpgrade(true)} size="lg" className="bg-red-600 hover:bg-red-700">
                    <Crown className="w-5 h-5 mr-2" />
                    Upgrade to Pro
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Recent Analyses */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Recent Analyses</h2>
            {videos.length > 0 && (
              <Button variant="outline" size="sm">
                View All
              </Button>
            )}
          </div>
          
          {videos.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800">
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-400 mb-3">
                  No analyses yet
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Upload your first training video to get started with AI-powered boxing analysis.
                </p>
                {canUpload && (
                  <Link to="/analyze">
                    <Button>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload First Video
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card key={video.id} hover className="bg-gray-900/50 border-gray-800 hover:border-red-500/50 transition-all duration-300">
                  <div className="aspect-video bg-gray-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {video.thumbnailUrl ? (
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
                        <Play className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-white mb-2 truncate">{video.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {format(video.createdAt, 'MMM d, yyyy')}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(video.status)}`}>
                      {getStatusIcon(video.status)}
                      <span className="ml-2 capitalize">{video.status}</span>
                    </div>
                    
                    {video.status === 'completed' && (
                      <Link to={`/analysis/${video.id}`}>
                        <Button size="sm" variant="outline" className="border-gray-600 hover:border-red-500">
                          View Analysis
                        </Button>
                      </Link>
                    )}
                    
                    {video.status === 'processing' && (
                      <Link to={`/analysis/${video.id}`}>
                        <Button size="sm" variant="outline" className="border-gray-600 hover:border-yellow-500">
                          View Progress
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
          <Card className="max-w-lg w-full mx-4 bg-gray-900 border-gray-700">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Upgrade to Pro</h3>
              <p className="text-gray-400 mb-8">
                Get 60 video analyses per month, advanced insights, and priority support.
              </p>
              
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-5xl font-bold text-white">$29</span>
                  <span className="text-gray-400 text-lg">/month</span>
                </div>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    60 video analyses per month
                  </div>
                  <div className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Advanced performance metrics
                  </div>
                  <div className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Export detailed reports
                  </div>
                  <div className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Priority support
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-gray-600 hover:border-gray-500"
                    onClick={() => setShowUpgrade(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700"
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