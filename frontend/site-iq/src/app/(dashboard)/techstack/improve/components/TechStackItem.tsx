import React from 'react';
import { motion } from 'framer-motion';
import { Check, TrendingUp, AlertCircle } from 'lucide-react';
import { TechStack } from '../types';

interface TechStackItemProps {
  tech: TechStack;
  title: string;
  index: number;
  delay?: number;
}

export const TechStackItem: React.FC<TechStackItemProps> = ({ tech, title, index, delay = 0 }) => {
  if (!tech || !tech.reason) {
    return null;
  }

  // Define gradient colors for each section
  const getGradientColors = (title: string) => {
    switch (title.toLowerCase()) {
      case 'frontend':
        return 'from-blue-500 to-purple-500';
      case 'backend':
        return 'from-green-500 to-teal-500';
      case 'database':
        return 'from-amber-500 to-orange-500';
      case 'hosting':
        return 'from-purple-500 to-pink-500';
      case 'other':
        return 'from-blue-700 to-indigo-700';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  // Parse the estimated improvement range
  const parseImprovementRange = (range: string = '0% - 0%') => {
    try {
      const [min, max] = range.split('-').map(str => {
        const num = parseInt(str.replace('%', '').trim());
        return isNaN(num) ? 0 : num;
      });
      return { min: min || 0, max: max || 0 };
    } catch (error) {
      console.error('Error parsing improvement range:', error);
      return { min: 0, max: 0 };
    }
  };

  const gradientColors = getGradientColors(title);
  const { min, max } = parseImprovementRange(tech.estimated_improvement);
  const avgImprovement = Math.round((min + max) / 2);

  const progressVariants = {
    initial: { width: "0%" },
    animate: { 
      width: `${avgImprovement}%`,
      transition: {
        duration: 1.5,
        ease: "easeOut",
        delay: delay + 0.5
      }
    }
  };

  return (
    <motion.div
      key={title}
      className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + (index * 0.1) }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${gradientColors} flex items-center justify-center mr-4 shadow-md`}>
          <span className="text-white font-semibold text-lg">{title[0]}</span>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{title}</h2>
          <div className="flex items-center mt-1">
            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${gradientColors}`}
                variants={progressVariants}
                initial="initial"
                animate="animate"
              />
            </div>
            <div className="ml-3 flex items-center">
              <TrendingUp size={16} className="text-green-500 mr-1" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {tech.estimated_improvement || '0% - 0%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {tech.problems && tech.problems.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-red-600 dark:text-red-400 mb-3 flex items-center">
            <AlertCircle size={16} className="mr-2" />
            Current System Problems
          </h3>
          <div className="space-y-2">
            {tech.problems.map((problem, i) => (
              <div 
                key={i}
                className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800"
              >
                <p className="text-sm text-red-700 dark:text-red-300">{problem}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">Improvement Analysis</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{tech.reason}</p>
      </div>
      
      {tech.stack && tech.stack.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-green-600 dark:text-green-400 mb-3">Recommended Technologies</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tech.stack.map((item, i) => (
                <div 
                  key={i} 
                  className="flex items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                >
                  <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}; 