import { useState, useCallback } from 'react';
import { improveTechStack } from '@/lib/api';
import { FormData, RecommendationResult } from '../types';

export const useAnalysis = () => {
  const [formData, setFormData] = useState<FormData>({
    websiteUrl: "",
    useCase: "",
    seoFocused: false,
    performanceFocused: false,
  });
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState("");
  const [isUrlValid, setIsUrlValid] = useState(true);
  const [isCheckingUrl, setIsCheckingUrl] = useState(false);
  const [urlWarning, setUrlWarning] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showMetaInfo, setShowMetaInfo] = useState(false);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const checkWebsiteExists = async (url: string): Promise<boolean> => {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), 5000);
      });

      const fetchPromise = fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
          'Accept': '*/*',
          'User-Agent': 'Mozilla/5.0 (compatible; SiteIQ/1.0)'
        }
      });

      await Promise.race([fetchPromise, timeoutPromise]);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'websiteUrl') {
      const isValid = validateUrl(value);
      setIsUrlValid(isValid);
      setUrlWarning("");
      if (!isValid) {
        setError("Please enter a valid URL (e.g., https://example.com)");
      } else {
        setError("");
      }
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUrlWarning("");

    if (!formData.websiteUrl || !formData.useCase) {
      setError("Please provide both website URL and use case");
      return;
    }

    if (!validateUrl(formData.websiteUrl)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setLoading(true);
    setIsCheckingUrl(true);
    
    try {
      const websiteExists = await checkWebsiteExists(formData.websiteUrl);
      if (!websiteExists) {
        setUrlWarning("Note: We couldn't verify the website's accessibility. The analysis will proceed but may be limited.");
      }

      const response = await improveTechStack({
        websiteUrl: formData.websiteUrl,
        useCase: formData.useCase,
        seoFocused: formData.seoFocused,
        performanceFocused: formData.performanceFocused
      });
      
      if (response) {
        const url = new URL(formData.websiteUrl);
        const websiteName = url.hostname.replace('www.', '');
        
        const recommendation = {
          ...response.recommendation,
          meta: {
            title: response.websiteTitle !== 'Untitled' ? response.websiteTitle : 
                  response.recommendation?.meta?.title || 
                  response.recommendation?.meta?.metaTags?.['og:title'] || 
                  response.recommendation?.meta?.metaTags?.['title'] || 
                  websiteName.charAt(0).toUpperCase() + websiteName.slice(1),
            description: response.websiteDescription || 
                        response.recommendation?.meta?.description || 
                        response.recommendation?.meta?.metaTags?.['og:description'] || 
                        response.recommendation?.meta?.metaTags?.['description'] || 
                        'No description available',
            scripts: response.scripts || response.recommendation?.meta?.scripts || [],
            keywords: response.recommendation?.meta?.keywords || [],
            metaTags: response.recommendation?.meta?.metaTags || {}
          }
        };
        
        setRecommendation(recommendation);
        setConversationId(response.conversationId);
        setShowMetaInfo(true);
        
        // Clear form data after successful submission
        setFormData({
          websiteUrl: "",
          useCase: "",
          seoFocused: false,
          performanceFocused: false,
        });
      } else {
        throw new Error("Unable to analyze the website. Please try again.");
      }
    } catch (err) {
      console.error("Error getting recommendation:", err);
      setError("Unable to analyze the website. Please check the URL and try again.");
    } finally {
      setLoading(false);
      setIsCheckingUrl(false);
    }
  };

  return {
    formData,
    loading,
    recommendation,
    error,
    isUrlValid,
    isCheckingUrl,
    urlWarning,
    conversationId,
    showMetaInfo,
    setRecommendation,
    setShowMetaInfo,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit
  };
}; 