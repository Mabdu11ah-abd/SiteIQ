'use client';
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const TeamMember = ({ 
  name, 
  role, 
  image, 
  delay = 0,
  description
}: { 
  name: string;
  role: string;
  image: string;
  delay?: number;
  description: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center group"
    >
      <div className="relative w-48 h-48 mb-4 rounded-full overflow-hidden group-hover:scale-105 transition-transform duration-300">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <h3 className="text-xl font-semibold mb-1 group-hover:text-accent transition-colors duration-300">{name}</h3>
      <p className="text-gray-600 font-medium mb-2">{role}</p>
      <p className="text-gray-500 text-sm text-center max-w-xs">{description}</p>
    </motion.div>
  );
};

const ValueCard = ({
  icon,
  title,
  description,
  delay = 0,
  image
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
  image: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group"
    >
      <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
        <CardContent className="p-6">
          <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors duration-300">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-sm font-medium text-accent mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse"></span>
              Empowering Digital Success
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="gradient-text">SiteIQ</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              We're revolutionizing website optimization through cutting-edge AI technology and deep SEO expertise, making digital success accessible to everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                At SiteIQ, we're on a mission to democratize digital success. We believe that every website, regardless of size or budget, deserves to be discovered and reach its full potential online.
              </p>
              <p className="text-gray-600 mb-6">
                Our platform combines the power of artificial intelligence with deep SEO expertise to provide actionable insights and recommendations that drive real results. We're not just another SEO tool – we're your strategic partner in digital growth.
              </p>
              <p className="text-gray-600">
                By making advanced SEO analysis and optimization accessible to everyone, we're helping businesses and individuals thrive in the digital landscape, one website at a time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">Our Values</h2>
            <p className="text-gray-600">
              These core values guide everything we do at SiteIQ, from product development to customer support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard
              icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              title="Innovation"
              description="We constantly push the boundaries of what's possible in SEO and website optimization through AI and machine learning."
              delay={0.2}
              image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60"
            />
            <ValueCard
              icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
              title="User-Centric"
              description="We put our users first, ensuring our tools are intuitive, effective, and tailored to their specific needs."
              delay={0.4}
              image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60"
            />
            <ValueCard
              icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
              title="Reliability"
              description="We maintain the highest standards of accuracy and reliability in our analysis and recommendations."
              delay={0.6}
              image="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60"
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-gray-600">
              The passionate individuals behind SiteIQ's success.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            <TeamMember
              name="Husnain Ali"
              role="Lead Developer"
              image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60"
              delay={0.2}
              description="Former Google SEO expert with 10+ years of experience in digital marketing and AI technology."
            />
            <TeamMember
              name="Muhammad Ateeb Saleeni"
              role="Project Manager"
              image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60"
              delay={0.4}
              description="AI and machine learning specialist with a background in developing enterprise-scale applications."
            />
            <TeamMember
              name="Syed Qadr Islam"
              role="Team Lead"
              image="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60"
              delay={0.6}
              description="Product visionary with expertise in UX design and data-driven product development."
            />
            <TeamMember
              name="Muhammad Abdullah"
              role="Intern"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60"
              delay={0.8}
              description="Leading our AI research initiatives with expertise in natural language processing and machine learning algorithms."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">Join Us on Our Journey</h2>
            <p className="text-gray-600 mb-8">
              Ready to optimize your website with AI-powered insights? Start your journey with SiteIQ today.
            </p>
            <motion.a
              href="/sign-up"
              className="inline-block px-8 py-3 rounded-lg gradient-bg text-white font-medium hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
