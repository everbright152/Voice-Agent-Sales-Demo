// ============================================================
// MrCeesAI Voice Demo — Core Types
// ============================================================

export type NicheType = 'legal' | 'beauty' | 'healthcare' | 'home_services' | 'financial';

export interface BusinessData {
  business_name: string;
  industry: NicheType;
  services: string[];
  locations: string[];
  hours: string;
  phone: string;
  email: string;
  faq: FAQ[];
  booking_link: string;
  summary: string;
  website_url: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface NicheConfig {
  id: NicheType;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  tone: string;
  callFlow: string[];
  qualificationQuestions: string[];
  bookingBehavior: string;
  sampleGreeting: string;
  roiConfig: ROIConfig;
  promptLayer: string;
}

export interface ROIConfig {
  avgMissedCallsPerMonth: number;
  avgRevenuePerLead: number;
  hoursPerMonth: number;
  closingRate: number;
}

export interface TranscriptMessage {
  role: 'agent' | 'user';
  content: string;
  timestamp: Date;
}

export interface WorkflowStep {
  id: number;
  label: string;
  description: string;
  icon: string;
  status: 'pending' | 'active' | 'completed';
}

export interface CrawlResult {
  success: boolean;
  data?: BusinessData;
  error?: string;
  raw?: string;
}

export interface RetellCallConfig {
  agentId: string;
  overrideAgentConfig: {
    prompt: {
      value: string;
    };
    agentName: string;
  };
}
