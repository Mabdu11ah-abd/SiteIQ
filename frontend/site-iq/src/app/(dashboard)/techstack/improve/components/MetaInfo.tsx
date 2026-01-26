import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WebsiteMeta } from '../types';

interface MetaInfoProps {
  meta: WebsiteMeta;
}

export const MetaInfo: React.FC<MetaInfoProps> = ({ meta }) => {
  if (!meta) {
    return (
      <Card className="bg-white dark:bg-gray-800 shadow-lg mb-6 rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800 dark:text-white">
            Website Meta Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-500 dark:text-gray-400">
            No metadata available for this website.
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData = meta.title || meta.description || 
                 (meta.keywords && meta.keywords.length > 0) || 
                 (meta.scripts && meta.scripts.length > 0) || 
                 (meta.metaTags && Object.keys(meta.metaTags).length > 0);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg mb-6 rounded-xl">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800 dark:text-white">
          Website Meta Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="text-gray-500 dark:text-gray-400">
            No metadata available for this website.
          </div>
        ) : (
          <div className="space-y-6">
            {meta.title && (
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Title</h3>
                <p className="text-slate-700 dark:text-slate-300 break-words">{meta.title}</p>
              </div>
            )}
            {meta.description && (
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Description</h3>
                <p className="text-slate-700 dark:text-slate-300 break-words">{meta.description}</p>
              </div>
            )}
            {meta.keywords && meta.keywords.length > 0 && (
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-3">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {meta.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* {meta.scripts && meta.scripts.length > 0 && (
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-3">Scripts</h3>
                <div className="space-y-2">
                  {meta.scripts.map((script, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white dark:bg-slate-800 rounded-lg text-sm font-mono overflow-x-auto border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
                    >
                      {script}
                    </div>
                  ))}
                </div>
              </div>
            )} */}
            {meta.metaTags && Object.keys(meta.metaTags).length > 0 && (
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-3">Meta Tags</h3>
                <div className="space-y-2">
                  {Object.entries(meta.metaTags).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-3 bg-white dark:bg-slate-800 rounded-lg text-sm border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
                    >
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{key}:</span>
                      <span className="text-slate-700 dark:text-slate-300 ml-2">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 