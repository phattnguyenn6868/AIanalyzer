export interface User {
  id: string;
  email: string;
  name?: string;
  plan: 'free' | 'pro';
  uploadsUsed: number;
  uploadsLimit: number;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due';
  createdAt: Date;
}

export interface VideoAnalysis {
  id: string;
  userId: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: Date;
  analysis?: FighterAnalysisData;
}

export interface FighterAnalysisData {
  fighter1: FighterAttributes;
  fighter2: FighterAttributes;
  winner: string;
  identifiedFighter1: IdentifiedFighter;
  identifiedFighter2: IdentifiedFighter;
}

export interface FighterAttributes {
  name: string;
  power: string;
  powerRating: number;
  defense: string;
  defenseRating: number;
  accuracy: string;
  accuracyRating: number;
  ringGeneralship: string;
  ringGeneralshipRating: number;
  fightIQ: string;
  fightIQRating: number;
  footwork: string;
  footworkRating: number;
  overallRating: number;
  punchesThrown: number;
  punchesLanded: number;
  accuracyPercentage: number;
  attacksFaced: number;
  attacksDefended: number;
  defenseEffectivenessPercentage: number;
}

export interface IdentifiedFighter {
  name: string;
  description1: string;
  description2: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  uploadsLimit: number;
  popular?: boolean;
}