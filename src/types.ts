export interface ManagementTeamMember {
  name: string;
  title: string;
  photoUrl: string;
}

export interface OfficeInfo {
  address: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
  managementTeam: ManagementTeamMember[];
}

export interface MetaData {
  title: string;
  subtitle: string;
  date: string;
  office: OfficeInfo;
}

export interface ProblemStatement {
  title: string;
  points: string[];
  opportunity: string;
}

export interface Pillar {
  name: string;
  description: string;
}

export interface Solution {
  title: string;
  pillars: Pillar[];
  differentiators: string[];
}

export interface MarketOverview {
  title: string;
  sawit: string;
  perikanan: string;
  pertanian: string;
  tam: string;
  sam: string;
  som: string;
}

export interface BusinessModel {
  title: string;
  revenueStreams: string[];
  costStructure: string[];
  scalability: string;
}

export interface Sector {
  name: string;
  valueChain: string;
  operations: string[];
  partners: string[];
  capacity: string;
  locations: string[];
  photos: string[];
}

export interface Traction {
  partnerships: string[];
  infrastructure: string[];
  technology: string[];
  impact: {
    farmers: string;
    employment: string;
    income: string;
  };
}

export interface RoadmapPhase {
  title: string;
  milestones: string[];
}

export interface Risk {
  risk: string;
  mitigation: string;
}

export interface InvestmentAsk {
  title: string;
  useOfFunds: string[];
  rationale: string[];
  investorReturn: string[];
}

export interface DeckData {
  meta: MetaData;
  executiveSummary: string[];
  problemStatement: ProblemStatement;
  solution: Solution;
  marketOverview: MarketOverview;
  businessModel: BusinessModel;
  sectors: {
    sawit: Sector;
    perikanan: Sector;
    pertanian: Sector;
  };
  competitiveAdvantages: string[];
  swot: {
    strengths: string;
    weaknesses: string;
    opportunities: string;
    threats: string;
  };
  traction: Traction;
  roadmap: {
    phase1: RoadmapPhase;
    phase2: RoadmapPhase;
    phase3: RoadmapPhase;
  };
  risks: Risk[];
  investmentAsk: InvestmentAsk;
  closing: string;
}

export interface DeckAssets {
  logo: string;
  managementPhotos: string[];
  portfolio: {
    sawitPlantation: string;
    sawitMill: string;
    fisheryOcean: string;
    fisheryColdStorage: string;
    farmVegetables: string;
    farmDistribution: string;
  };
}

export interface APIResponse {
  status: 'success' | 'error';
  data: DeckData;
  assets: DeckAssets;
  message?: string;
}
