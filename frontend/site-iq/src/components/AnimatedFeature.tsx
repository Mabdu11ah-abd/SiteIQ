'use client';
import React from "react";
import { motion } from "framer-motion";

interface AnimatedFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export default function AnimatedFeature({ icon, title, description, delay = 0 }: AnimatedFeatureProps) {
  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 relative overflow-hidden transition-all duration-300 hover:shadow-xl group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/10 opacity-0 transition-opacity duration-300 z-0"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
      
      <motion.div
        className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 relative z-10"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        {icon}
      </motion.div>
      
      <motion.h3 
        className="text-xl font-semibold mb-2 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.2 }}
      >
        {title}
      </motion.h3>

      <motion.p 
        className="text-slate-600 dark:text-slate-400 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.3 }}
      >
        {description}
      </motion.p>
      
      {/* Animated particle effects */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/5 rounded-full"></div>
      <motion.div 
        className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-blue-400/40"
        animate={{
          y: [0, -10, 0],
          opacity: [0, 1, 0],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: delay * 2,
        }}
      />
      <motion.div 
        className="absolute bottom-8 right-8 w-3 h-3 rounded-full bg-purple-400/30"
        animate={{
          y: [0, -15, 0],
          opacity: [0, 1, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: delay * 1.5 + 1,
        }}
      />
      <motion.div
        className="absolute bottom-3 right-12 w-1 h-1 rounded-full bg-violet-400/50"
        animate={{
          y: [0, -7, 0],
          opacity: [0, 1, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: delay + 2,
        }}
      />
    </motion.div>
  );
}
