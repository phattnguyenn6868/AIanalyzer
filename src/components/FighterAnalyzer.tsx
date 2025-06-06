import React from 'react';
import { FighterAnalysisData } from '../types';
import { Card } from './ui/Card';

interface FighterAnalyzerProps {
  videoUrl: string;
  analysis: FighterAnalysisData;
}

export const FighterAnalyzer: React.FC<FighterAnalyzerProps> = ({ analysis }) => {
  const renderFighterAnalysis = (fighter: any, fighterInfo: any, fighterNum: number) => {
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h4 className="text-xl font-semibold text-white mb-2">
            Fighter {fighterNum}: {fighter.name}
          </h4>
          <div className="text-sm text-gray-400 space-y-1">
            <p><em>{fighterInfo.description1}</em></p>
            <p><em>{fighterInfo.description2}</em></p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500 mb-2">
              {fighter.overallRating}/100
            </div>
            <div className="text-gray-400">Overall Rating</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Power:</span>
              <span className="text-red-500 font-semibold">{fighter.powerRating}/100</span>
            </div>
            <p className="text-sm text-gray-400">{fighter.power}</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Defense:</span>
              <span className="text-red-500 font-semibold">{fighter.defenseRating}/100</span>
            </div>
            <p className="text-sm text-gray-400">{fighter.defense}</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Accuracy:</span>
              <span className="text-red-500 font-semibold">{fighter.accuracyRating}/100</span>
            </div>
            <p className="text-sm text-gray-400">{fighter.accuracy}</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Ring Generalship:</span>
              <span className="text-red-500 font-semibold">{fighter.ringGeneralshipRating}/100</span>
            </div>
            <p className="text-sm text-gray-400">{fighter.ringGeneralship}</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Fight IQ:</span>
              <span className="text-red-500 font-semibold">{fighter.fightIQRating}/100</span>
            </div>
            <p className="text-sm text-gray-400">{fighter.fightIQ}</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Footwork:</span>
              <span className="text-red-500 font-semibold">{fighter.footworkRating}/100</span>
            </div>
            <p className="text-sm text-gray-400">{fighter.footwork}</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700">
          <h5 className="text-lg font-semibold text-white mb-3">Performance Metrics</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Punches Thrown:</span>
              <span className="text-white ml-2">{fighter.punchesThrown}</span>
            </div>
            <div>
              <span className="text-gray-400">Punches Landed:</span>
              <span className="text-white ml-2">{fighter.punchesLanded}</span>
            </div>
            <div>
              <span className="text-gray-400">Accuracy %:</span>
              <span className="text-white ml-2">{fighter.accuracyPercentage.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-gray-400">Defense Effectiveness:</span>
              <span className="text-white ml-2">{fighter.defenseEffectivenessPercentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          {renderFighterAnalysis(analysis.fighter1, analysis.identifiedFighter1, 1)}
        </Card>
        
        <Card>
          {renderFighterAnalysis(analysis.fighter2, analysis.identifiedFighter2, 2)}
        </Card>
      </div>
    </div>
  );
};