import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Clock, Target, Shield, Zap } from 'lucide-react';
import { useVideo } from '../contexts/VideoContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { VideoPlayer } from '../components/VideoPlayer';
import { FighterAnalyzer } from '../components/FighterAnalyzer';
import { PerformanceChart } from '../components/PerformanceChart';

export const AnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getVideo, updateVideo } = useVideo();
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const video = id ? getVideo(id) : undefined;

  useEffect(() => {
    if (!video) {
      navigate('/dashboard');
      return;
    }

    if (video.status === 'processing') {
      setIsAnalyzing(true);
      // Simulate analysis completion after 10 seconds
      const timer = setTimeout(() => {
        updateVideo(video.id, {
          status: 'completed',
          analysis: {
            fighter1: {
              name: 'Fighter in Red Gloves',
              power: 'Demonstrated strong and impactful power throughout the session.',
              powerRating: 85,
              defense: 'Showed effective defensive maneuvers and maintained good guard.',
              defenseRating: 78,
              accuracy: 'Displayed good precision in landing clean shots.',
              accuracyRating: 82,
              ringGeneralship: 'Effectively controlled ring space and dictated pace.',
              ringGeneralshipRating: 80,
              fightIQ: 'Demonstrated strong strategic thinking and adaptation.',
              fightIQRating: 83,
              footwork: 'Utilized balanced footwork to create angles.',
              footworkRating: 79,
              overallRating: 81,
              punchesThrown: 45,
              punchesLanded: 37,
              accuracyPercentage: 82.2,
              attacksFaced: 38,
              attacksDefended: 30,
              defenseEffectivenessPercentage: 78.9,
            },
            fighter2: {
              name: 'Fighter in Blue Shorts',
              power: 'Exhibited moderate power with room for improvement.',
              powerRating: 72,
              defense: 'Defensive skills were adequate but inconsistent.',
              defenseRating: 68,
              accuracy: 'Accuracy was below average with several missed opportunities.',
              accuracyRating: 65,
              ringGeneralship: 'Struggled to control ring positioning effectively.',
              ringGeneralshipRating: 63,
              fightIQ: 'Showed basic strategic understanding but lacked adaptation.',
              fightIQRating: 67,
              footwork: 'Footwork was functional but lacked fluidity.',
              footworkRating: 70,
              overallRating: 68,
              punchesThrown: 52,
              punchesLanded: 34,
              accuracyPercentage: 65.4,
              attacksFaced: 37,
              attacksDefended: 25,
              defenseEffectivenessPercentage: 67.6,
            },
            winner: 'Winner: Fighter 1 due to higher Overall Rating and superior Ring Generalship score.',
            identifiedFighter1: {
              name: 'Fighter in Red Gloves',
              description1: 'Wears red boxing gloves and black shorts.',
              description2: 'Appears to have an orthodox stance.',
            },
            identifiedFighter2: {
              name: 'Fighter in Blue Shorts',
              description1: 'Wears blue shorts and white gloves.',
              description2: 'Shows a southpaw stance preference.',
            },
          },
        });
        setIsAnalyzing(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [video, updateVideo, navigate]);

  if (!video || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Analysis not found</h1>
          <Link to="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (video.status === 'processing' || isAnalyzing) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <h1 className="text-3xl font-bold text-white">{video.title}</h1>
              <p className="text-gray-400">Analysis in progress...</p>
            </div>
          </div>

          <Card>
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Analyzing Your Video
              </h3>
              <p className="text-gray-400 mb-4">
                Our AI is processing your video and analyzing fighter performance. This may take a few minutes.
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Identifying fighters
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Analyzing technique
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Calculating metrics
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (video.status === 'failed') {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <Card className="border-red-500">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-red-400 text-2xl">!</span>
              </div>
              <h3 className="text-xl font-semibold text-red-400 mb-2">
                Analysis Failed
              </h3>
              <p className="text-gray-400 mb-6">
                We couldn't analyze your video. Please try uploading again.
              </p>
              <Link to="/analyze">
                <Button>Upload New Video</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // If analysis is completed, show the original FighterAnalyzer component
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">{video.title}</h1>
              <p className="text-gray-400">Complete analysis results</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Analysis Results */}
        {video.analysis && (
          <div className="space-y-8">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <h3 className="text-xl font-semibold text-white mb-4">Performance Overview</h3>
                <PerformanceChart 
                  fighter1={video.analysis.fighter1}
                  fighter2={video.analysis.fighter2}
                />
              </Card>
              
              <Card>
                <h3 className="text-xl font-semibold text-white mb-4">Session Result</h3>
                <div className="text-center py-8">
                  <div className="text-3xl font-bold text-red-500 mb-4">
                    {video.analysis.winner.includes('Fighter 1') ? 
                      video.analysis.identifiedFighter1.name : 
                      video.analysis.identifiedFighter2.name
                    } Wins
                  </div>
                  <p className="text-gray-400">
                    {video.analysis.winner.split('due to')[1] || 'Based on overall performance metrics'}
                  </p>
                </div>
              </Card>
            </div>

            {/* Detailed Analysis - Use the original FighterAnalyzer component */}
            <Card>
              <h3 className="text-xl font-semibold text-white mb-6">Detailed Fighter Analysis</h3>
              <FighterAnalyzer 
                videoUrl={video.videoUrl}
                analysis={video.analysis}
              />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};