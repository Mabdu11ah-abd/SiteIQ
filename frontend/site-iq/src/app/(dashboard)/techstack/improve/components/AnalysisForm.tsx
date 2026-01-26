import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader } from 'lucide-react';
import { FormData } from '../types';
import { AlertCircle } from 'lucide-react';

interface AnalysisFormProps {
  formData: {
    websiteUrl: string;
    useCase: string;
    seoFocused: boolean;
    performanceFocused: boolean;
  };
  loading: boolean;
  error: string;
  urlWarning: string;
  isUrlValid: boolean;
  isCheckingUrl: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCheckboxChange: (name: string, checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AnalysisForm: React.FC<AnalysisFormProps> = ({
  formData,
  loading,
  error,
  urlWarning,
  isUrlValid,
  isCheckingUrl,
  onInputChange,
  onCheckboxChange,
  onSubmit,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter Your Website Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Website URL
              </label>
              <div className="mt-1 relative">
            <Input
              id="websiteUrl"
              name="websiteUrl"
                  type="url"
              placeholder="https://example.com"
              value={formData.websiteUrl}
              onChange={onInputChange}
                  className={`${!isUrlValid ? 'border-red-500 focus:ring-red-500' : ''}`}
                  disabled={loading}
                />
                {isCheckingUrl && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
              {!isUrlValid && (
                <p className="mt-1 text-sm text-red-500">
                  Please enter a valid URL (e.g., https://example.com)
                </p>
              )}
              {urlWarning && (
                <div className="mt-2 rounded-md bg-yellow-50 dark:bg-yellow-900/50 p-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700 dark:text-yellow-200">{urlWarning}</p>
                    </div>
                  </div>
                </div>
              )}
          </div>

            <div>
              <label htmlFor="useCase" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Business Type and Use Case in detail
              </label>
              <div className="mt-1">
                
            <Textarea
              id="useCase"
              name="useCase"
                  placeholder="Describe your website's purpose e.g., E-commerce website for selling handmade crafts, requiring inventory management and secure payment processing.."
              value={formData.useCase}
              onChange={onInputChange}
                  disabled={loading}
            />
              </div>
          </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="seoFocused" 
                  name="seoFocused"
                  type="checkbox"
                  checked={formData.seoFocused}
                  onChange={(e) => onCheckboxChange('seoFocused', e.target.checked)}
                  disabled={loading}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="seoFocused" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  SEO Focused
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="performanceFocused" 
                  name="performanceFocused"
                  type="checkbox"
                  checked={formData.performanceFocused}
                  onChange={(e) => onCheckboxChange('performanceFocused', e.target.checked)}
                  disabled={loading}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="performanceFocused" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Performance Focused
                </label>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}

          <Button 
            type="submit"
            disabled={loading || !isUrlValid || isCheckingUrl}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </div>
            ) : (
              'Analyze Tech Stack'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 