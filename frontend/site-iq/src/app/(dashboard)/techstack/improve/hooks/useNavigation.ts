import { useState } from 'react';
import { RecommendationResult } from '../types';

export const useNavigation = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [cameFromAnalysis, setCameFromAnalysis] = useState(false);
  const [previousState, setPreviousState] = useState<{
    type: 'analysis' | 'chat';
    recommendation?: RecommendationResult | null;
    chatId?: string | null;
    chatMessages?: Array<{ role: string; content: string }>;
  } | null>(null);

  const handleBack = (showChat: boolean, recommendation: any) => {
    if (showChat) {
      setCameFromAnalysis(false);
    } else if (recommendation) {
      setCameFromAnalysis(false);
    }
  };

  const handleForward = () => {
    if (previousState) {
      if (previousState.type === 'chat') {
        setCameFromAnalysis(true);
      } else if (previousState.type === 'analysis') {
        setCameFromAnalysis(true);
      }
    }
  };

  const handleNewAnalysis = () => {
    setCameFromAnalysis(false);
    setPreviousState(null);
  };

  return {
    showSidebar,
    cameFromAnalysis,
    previousState,
    setShowSidebar,
    setCameFromAnalysis,
    setPreviousState,
    handleBack,
    handleForward,
    handleNewAnalysis
  };
}; 