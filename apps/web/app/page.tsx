'use client';

import { Button } from "@/components/ui/button";
import { Clock, Target, Users, ArrowRight, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Plus_Jakarta_Sans, Space_Mono, Inter } from 'next/font/google';

// Modern primary font
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

// Secondary font for accents
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// Monospace font only for selective elements
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
});

// Updated theme colors to match dashboard
const colors = {
  primary: '#9333ea',       // Violet-600
  primaryHover: '#7e22ce',  // Violet-700
  secondary: '#4c1d95',     // Violet-900
  accent: '#a78bfa',        // Violet-400
  dark: '#0A0A0A',          // Near black
  cardBg: 'rgba(24, 24, 27, 0.4)', // zinc-900 with opacity
  borderColor: 'rgba(39, 39, 42, 0.5)', // zinc-800 with opacity
  textPrimary: '#f4f4f5',    // zinc-100
  textSecondary: '#a1a1aa'   // zinc-400
};

// Enhanced animation variants
const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] 
    }
  }
};

const slideIn = {
  initial: { opacity: 0, x: -30 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] 
    }
  }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const scaleOnHover = {
  whileHover: { 
    scale: 1.05,
    transition: { duration: 0.3 }
  }
};

export default function Home() {
  // Reference for parallax effects
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax transformations
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  
  return (
    <div 
      className={`min-h-screen bg-[#0A0A0A] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] ${jakarta.variable} ${inter.variable} ${spaceMono.variable} font-sans text-zinc-100`} 
      ref={containerRef}
    >
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Floating elements */}
        <motion.div 
          className="absolute top-[20%] left-[5%] w-20 h-20 rounded-full opacity-20 bg-violet-600"
          animate={{ 
            y: [0, 15, 0],
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-[30%] right-[10%] w-32 h-32 rounded-full opacity-15 bg-violet-500"
          animate={{ 
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Main Content */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-48 relative z-10"
        >
          <motion.div variants={fadeIn} className="text-center">
            <motion.div 
              variants={scaleOnHover}
              whileHover="whileHover"
              className="inline-flex items-center px-5 py-2 rounded-full bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-2xl text-zinc-100 mb-10"
            >
              <Sparkles className="w-4 h-4 mr-2 text-violet-400" />
              <span className="text-sm font-medium">Revolutionizing Goal Achievement</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-none">
              <motion.span 
                className="block text-zinc-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Close Your
              </motion.span>
              <motion.span 
                className="block mt-2 text-violet-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Execution Gap
              </motion.span>
            </h1>
            
            <motion.p 
              variants={fadeIn}
              className="mt-8 text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light"
            >
              Transform goals into achievements through structured planning 
              and collaborative execution. Two simple steps: <span className="relative inline-block">
                <span className="relative z-10 font-semibold text-white">Plan. Execute.</span>
                <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-violet-400 opacity-20 blur-sm rounded-md -z-0"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-violet-400 opacity-10 rounded-md transform scale-105 -z-0"></span>
              </span>
            </motion.p>
            
            <motion.div 
              variants={fadeIn} 
              className="mt-14"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button size="lg" className="text-lg px-10 py-7 h-16 bg-violet-600 hover:bg-violet-700 rounded-xl text-zinc-100 font-bold">
                Start Your Journey <ArrowRight className="ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-36 relative overflow-hidden border-t border-zinc-800/50">
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <motion.h2 
            variants={fadeIn} 
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-zinc-100"
          >
            Powerful Features to Boost Productivity
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Target className="w-12 h-12 text-violet-400" />}
              title="Goal Bucket System"
              description="Collect and organize all your goals in one place. Focus on what matters by selecting 3-5 daily priorities."
            />
            <FeatureCard
              icon={<Clock className="w-12 h-12 text-violet-400" />}
              title="Focused Timer"
              description="Stay on track with our specialized timer designed for deep work and focused execution."
            />
            <FeatureCard
              icon={<Users className="w-12 h-12 text-violet-400" />}
              title="Collaborative Sessions"
              description="Join forces with others in real-time collaborative timer sessions to boost accountability."
            />
          </div>
        </motion.div>
      </div>

      {/* How It Works */}
      <div className="py-36 relative overflow-hidden border-t border-zinc-800/50">
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <motion.h2 
            variants={fadeIn} 
            className="text-4xl font-bold text-center mb-24 text-zinc-100"
          >
            How It Works
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div variants={stagger} className="space-y-14 relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-violet-700"></div>
              
              <Step
                number="01"
                title="Plan Your Goals"
                description="Add all your goals to your personal bucket. Prioritize and select 3-5 goals for focused daily execution."
              />
              <Step
                number="02"
                title="Set Your Timer"
                description="Choose between solo or collaborative timer sessions. Set your duration and get ready to focus."
              />
              <Step
                number="03"
                title="Execute & Achieve"
                description="Work on your goals with intense focus. Track progress and celebrate completions with your accountability partners."
              />
            </motion.div>
            
            <motion.div 
              variants={slideIn}
              className="bg-zinc-900/40 rounded-2xl p-6 border border-zinc-800/50 backdrop-blur-2xl"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-xl overflow-hidden">
                <motion.img
                  src="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80"
                  alt="Productivity Timer"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="py-32 relative overflow-hidden border-t border-zinc-800/50">
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        >
          <motion.h2 
            variants={fadeIn} 
            className="text-4xl md:text-5xl font-bold mb-8 text-zinc-100"
          >
            Ready to Close Your Execution Gap?
          </motion.h2>
          
          <motion.p 
            variants={fadeIn} 
            className="text-xl md:text-2xl mb-14 text-zinc-400 max-w-3xl mx-auto"
          >
            Join thousands of achievers who are turning their goals into reality.
          </motion.p>
          
          <motion.div 
            variants={fadeIn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button size="lg" className="text-lg px-10 py-7 h-16 bg-violet-600 hover:bg-violet-700 rounded-xl text-zinc-100 font-medium">
              Get Started Now <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div 
      variants={fadeIn}
      whileHover={{ y: -8 }}
      className="bg-zinc-900/40 p-8 rounded-xl border border-zinc-800/50 backdrop-blur-2xl transition-all duration-300 h-full flex flex-col"
    >
      <div className="mb-6 bg-zinc-800/50 p-4 rounded-lg inline-flex w-fit">{icon}</div>
      <h3 className="text-2xl font-bold mb-4 text-zinc-100">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <motion.div variants={fadeIn} className="flex gap-6 relative">
      <div className="text-4xl font-bold text-violet-500 relative z-10 flex items-center justify-center w-12 h-12 font-mono">
        <div className="absolute inset-0 bg-zinc-800/60 rounded-full border border-zinc-700/30 -z-10"></div>
        {number}
      </div>
      <div className="pt-1.5">
        <h3 className="text-2xl font-bold mb-3 text-zinc-100">{title}</h3>
        <p className="text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}