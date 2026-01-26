'use client'; // Marking this as a client-side component

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      containerRef.current.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []); // Empty dependency array ensures this effect runs once on mount

  return (
    <div ref={containerRef} className="relative transition-transform duration-200 ease-out">
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="h-6 w-24 bg-slate-700 rounded"></div>
          </div>

          <div className="space-y-4">
            <div className="h-10 bg-slate-700 rounded-md w-full"></div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div className="h-20 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-md animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div
                  className="h-20 bg-gradient-to-r from-purple-500/30 to-violet-500/30 rounded-md animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-slate-700 rounded w-1/2"></div>
              <div className="h-32 bg-slate-800 rounded-md p-3">
                <div className="space-y-2">
                  <div className="h-4 bg-slate-700 rounded w-full"></div>
                  <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-700 rounded w-4/6"></div>
                  <div className="h-4 bg-slate-700 rounded w-3/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated elements */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <motion.div
          className="absolute top-1/3 left-1/3 w-12 h-12 bg-violet-500/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
      <div
        className="absolute -bottom-8 -left-8 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 right-1/3 w-16 h-16 bg-violet-500/10 rounded-full blur-xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Floating elements */}
      <motion.div
        className="absolute -top-10 right-10 w-8 h-8"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 rounded-md opacity-80"></div>
      </motion.div>

      <motion.div
        className="absolute -bottom-5 right-20 w-6 h-6"
        animate={{
          y: [0, 10, 0],
          rotate: [0, -5, 0, 5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-violet-400 rounded-full opacity-80"></div>
      </motion.div>
    </div>
  );
}
