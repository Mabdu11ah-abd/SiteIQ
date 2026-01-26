import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  CheckCircle,
  Lightbulb,
  Target,
  TrendingUp,
  type LucideIcon
} from 'lucide-react';

interface SeoRecommendationProps {
  markdown: string;
  index: number;
}

const SeoRecommendation: React.FC<SeoRecommendationProps> = ({ markdown, index }) => {
  const getIcon = () => {
    const icons: (LucideIcon | undefined)[] = [CheckCircle, Lightbulb, Target, TrendingUp];
    const IconComponent = icons[index % icons.length];

    if (!IconComponent) {
      console.warn(`Icon at index ${index % icons.length} is undefined. Falling back to CheckCircle.`);
      return <CheckCircle className="w-6 h-6 text-purple-600" />;
    }

    return <IconComponent className="w-6 h-6 text-purple-600" />;
  };

  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-white to-purple-50/30 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-purple-100/50 hover:border-purple-200 animate-fade-in">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-200/20 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors duration-300">
          {getIcon()}
        </div>
        <h3 className="text-lg font-semibold text-purple-800">
          SEO Recommendation #{index + 1}
        </h3>
      </div>

      <div className="relative z-10">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-3xl font-bold mb-6 text-purple-900 leading-tight" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-2xl font-semibold mb-4 text-purple-800 leading-tight" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-xl font-semibold mb-3 text-purple-700 leading-tight" {...props} />
            ),
            h4: ({ node, ...props }) => (
              <h4 className="text-lg font-semibold mb-2 text-purple-600" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="text-gray-700 mb-4 leading-relaxed text-base" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="space-y-2 mb-4 pl-0" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="space-y-2 mb-4 pl-0" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="flex items-start gap-3 text-gray-700 leading-relaxed">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <span {...props} />
              </li>
            ),
            strong: ({ node, ...props }) => (
              <strong className="text-purple-900 font-semibold bg-purple-100/50 px-1 py-0.5 rounded" {...props} />
            ),
            em: ({ node, ...props }) => (
              <em className="text-purple-700 italic" {...props} />
            ),
            code: ({ node, ...props }) => {
              const isInline = (props as any).inline;
              return isInline ? (
                <code className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-mono" {...props} />
              ) : (
                <code className="block bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto" {...props} />
              );
            },
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-purple-300 bg-purple-50/50 pl-6 py-3 my-4 italic text-purple-800" {...props} />
            ),
            hr: () => (
              <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-purple-200 rounded-lg overflow-hidden" {...props} />
              </div>
            ),
            th: ({ node, ...props }) => (
              <th className="bg-purple-100 border border-purple-200 px-4 py-3 text-left text-purple-800 font-semibold" {...props} />
            ),
            td: ({ node, ...props }) => (
              <td className="border border-purple-200 px-4 py-3 text-gray-700" {...props} />
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </div>
  );
};

export default SeoRecommendation;
