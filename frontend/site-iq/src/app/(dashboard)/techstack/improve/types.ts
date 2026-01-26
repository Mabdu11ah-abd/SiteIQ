export interface TechStack {
  stack: string[];
  reason: string;
  estimated_improvement?: string;
  problems?: string[];
}

export interface WebsiteMeta {
  title: string;
  description: string;
  keywords: string[];
  scripts: string[];
  metaTags: { [key: string]: string };
}

export interface RecommendationResult {
  frontend: TechStack;
  backend: TechStack;
  database: TechStack;
  hosting: TechStack;
  other: TechStack;
  meta: WebsiteMeta;
}

export interface ChatHistory {
  _id?: string;
  title: string;
  lastMessage: string;
  timestamp?: string;
  lastUpdated?: string;
  createdAt?: string;
  websiteUrl?: string;
  useCase?: string;
  id?: string;
  history?: Array<{
    role?: string;
    content?: string;
    message?: string;
    isUser?: boolean;
  }>;
}

export interface FormData {
  websiteUrl: string;
  useCase: string;
  seoFocused: boolean;
  performanceFocused: boolean;
} 