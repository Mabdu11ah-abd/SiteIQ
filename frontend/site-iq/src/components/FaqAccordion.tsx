'use client'; // Add this line to mark this as a client component

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Ensure you're importing framer-motion properly
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: "What is SiteIQ?",
      answer:
        "SiteIQ is a SaaS platform that provides comprehensive SEO analysis and optimization recommendations for websites. It uses AI to analyze your website, generate detailed reports, and provide actionable recommendations to improve your SEO performance.",
    },
    {
      question: "How does SiteIQ work?",
      answer:
        "SiteIQ works by analyzing your website URL using various APIs to gather SEO data. It then processes this data through our AI models to generate personalized recommendations for improving your website's SEO performance. The platform also provides tech stack recommendations based on your business needs and includes a chatbot for instant SEO advice.",
    },
    {
      question: "Do I need technical knowledge to use SiteIQ?",
      answer:
        "No, SiteIQ is designed to be user-friendly and accessible to users with all levels of technical expertise. Our AI-powered recommendations are presented in clear, actionable language, and our chatbot can help explain technical concepts in simple terms.",
    },
    {
      question: "How often should I run an SEO analysis?",
      answer:
        "For optimal results, we recommend running an SEO analysis at least once a month. However, if you're actively making changes to your website or implementing our recommendations, you might want to run analyses more frequently to track your progress.",
    },
    {
      question: "Can SiteIQ analyze any type of website?",
      answer:
        "Yes, SiteIQ can analyze any publicly accessible website regardless of the platform or technology it's built on. Whether you're using WordPress, Shopify, Wix, or a custom-built solution, our platform can provide valuable insights and recommendations.",
    },
    {
      question: "Is there a limit to how many websites I can analyze?",
      answer:
        "The number of websites you can analyze depends on your subscription plan. Our Starter plan allows for 5 analyses per month, Professional plan allows for 20, and Enterprise plan offers unlimited analyses. You can upgrade your plan at any time if you need to analyze more websites.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          className="border border-slate-200 dark:zzborder-slate-800 rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
        >
          <motion.button
            className="flex items-center justify-between w-full p-4 text-left bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            onClick={() => toggleFaq(index)}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-medium">{faq.question}</span>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ChevronDown className="h-5 w-5 text-slate-500" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="p-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-t border-slate-200 dark:border-slate-700">
                  <motion.p
                    className="text-slate-600 dark:text-slate-400"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {faq.answer}
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
