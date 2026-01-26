'use client'; // Add this line

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

const PricingPlans = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Free",
      price: 0,
      description: "Basic SEO analysis for individuals",
      features: [
        "5 Website Analysis per month",
        "Basic SEO report",
        "Limited AI recommendations",
        "Email support"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline",
      popular: false,
      delay: 0.3,
    },
    {
      name: "Pro",
      price: isAnnual ? 29 : 39,
      description: "Advanced SEO tools for professionals",
      features: [
        "Unlimited website analysis",
        "Comprehensive SEO reports",
        "Full AI recommendations",
        "Tech stack suggestions",
        "Priority email support",
        "API access"
      ],
      buttonText: "Subscribe",
      buttonLink: "/subscribe",
      buttonVariant: "default",
      popular: true,
      delay: 0.5,
    },
    {
      name: "Enterprise",
      price: isAnnual ? 79 : 99,
      description: "Custom solutions for businesses",
      features: [
        "Everything in Pro",
        "Custom domain tracking",
        "White-label reports",
        "Advanced AI chatbot",
        "Dedicated support",
        "Custom integrations"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline",
      popular: false,
      delay: 0.7,
    }
  ];

  return (
    <section id="pricing" className="py-24 relative">
      {/* Background effects */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </motion.h2>
          <motion.p 
            className="text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Choose the plan that best fits your needs. All plans include core SEO analysis features.
          </motion.p>
          
          <motion.div 
            className="flex items-center justify-center space-x-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className={`text-sm font-medium ${!isAnnual ? "text-gray-900" : "text-gray-500"}`}>Monthly</span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-accent"
            />
            <div className="flex items-center">
              <span className={`text-sm font-medium ${isAnnual ? "text-gray-900" : "text-gray-500"}`}>Annually</span>
              <motion.span 
                className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                Save 20%
              </motion.span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className="h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: plan.delay }}
              whileHover={{ translateY: -10 }}
            >
              <Card 
                className={`h-full relative ${plan.popular ? 'border-accent shadow-lg shadow-accent/10' : 'border-gray-200'}`}
              >
                {plan.popular && (
                  <motion.div 
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                  >
                    <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
                      Most Popular
                    </span>
                  </motion.div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-baseline">
                    <span className="text-2xl font-bold">{plan.name}</span>
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-500 ml-2">{plan.price > 0 ? `/month` : ""}</span>
                    {isAnnual && plan.price > 0 && (
                      <span className="block text-sm text-gray-500">billed annually</span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: plan.delay + i * 0.1 }}
                      >
                        <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      className={`w-full ${plan.popular ? 'gradient-bg text-white' : ''}`} 
                      variant={plan.buttonVariant as any}
                    >
                      {plan.buttonText}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
