'use client'
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { createCheckoutSession } from "@/lib/api";

const PricingPlans = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Pricing - SiteIQ";
    window.scrollTo(0, 0);
  }, []);

  const handleSubscribe = async (planName: string, price: number) => {
    if (price === 0) {
      window.location.href = '/sign-up';
      return;
    }

    setLoading(planName);
    try {
      const lookupKey = isAnnual 
        ? `${planName.toLowerCase()}_annual` 
        : `${planName.toLowerCase()}_monthly`;
      
      const data = await createCheckoutSession(lookupKey);
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Subscription error",
        description: error.message || "Failed to process subscription",
      });
    } finally {
      setLoading(null);
    }
  };

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
      price: isAnnual ? 20 : 20,
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
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <section id="pricing" className="pt-32 pb-24 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Choose the plan that best fits your needs. All plans include core SEO analysis features.
            </p>
            
            <div className="flex items-center justify-center space-x-3 mb-8">
              <span className={`text-sm font-medium ${!isAnnual ? "text-gray-900" : "text-gray-500"}`}>Monthly</span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-accent"
              />
              <div className="flex items-center">
                <span className={`text-sm font-medium ${isAnnual ? "text-gray-900" : "text-gray-500"}`}>Annually</span>
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
                >
                  Save 20%
                </motion.span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: plan.delay }}
              >
                <Card 
                  className={`relative h-full transform transition-all duration-300 hover:shadow-xl ${
                    plan.popular 
                      ? 'border-accent shadow-lg shadow-accent/10 hover:scale-105' 
                      : 'border-gray-200 hover:scale-102'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                        className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-white"
                      >
                        Most Popular
                      </motion.span>
                    </div>
                  )}
                  <CardHeader className={`${plan.popular ? 'bg-gradient-to-r from-accent/5 to-primary/5 rounded-t-lg' : ''}`}>
                    <CardTitle className="flex items-baseline">
                      <span className="text-2xl font-bold">{plan.name}</span>
                    </CardTitle>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-5xl font-bold">${plan.price}</span>
                      <span className="text-gray-500 ml-2">{plan.price > 0 ? `/month` : ""}</span>
                    </div>
                    {isAnnual && plan.price > 0 && (
                      <span className="block text-sm text-gray-500 mt-1">billed annually</span>
                    )}
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <motion.li 
                          key={i} 
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: plan.delay + (i * 0.1) }}
                        >
                          <svg className="h-5 w-5 text-green-500 shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-600">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full relative overflow-hidden group ${plan.popular ? 'gradient-bg text-white' : ''}`} 
                      variant={plan.buttonVariant as any}
                      onClick={() => handleSubscribe(plan.name, plan.price)}
                      disabled={loading === plan.name}
                    >
                      <span className="relative z-10">
                        {loading === plan.name ? "Processing..." : plan.buttonText}
                      </span>
                      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-20 text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Need a custom solution?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Contact our sales team for a tailored plan that meets your specific requirements.
            </p>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default PricingPlans;
