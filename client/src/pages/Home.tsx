import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Zap, Target, TrendingUp, Users, Shield, Brain, Globe, BarChart3, FileText, Lightbulb } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_professional_blue_data_network_background.png";
import { useEffect, useState, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { translations } from "@/lib/translations";
import CardSwap, { Card } from "@/components/ui/CardSwap";
import Silk from "@/components/ui/Silk";

export default function Home() {
  const { profile } = useApp();
  const t = translations[profile.language as keyof typeof translations] || translations.English;
  const [featuresRevealed, setFeaturesRevealed] = useState(false);
  const [stepsRevealed, setStepsRevealed] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (entry.target === featuresRef.current) {
          setFeaturesRevealed(true);
        }
        if (entry.target === stepsRef.current) {
          setStepsRevealed(true);
        }
      }
    }, observerOptions);

    if (featuresRef.current) observer.observe(featuresRef.current);
    if (stepsRef.current) observer.observe(stepsRef.current);

    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, type: "spring", damping: 20, stiffness: 100 } as any
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Silk Background */}
      <Silk 
        speed={2}
        scale={1.5}
        color="#3b82f6"
        noiseIntensity={1.2}
        rotation={0.1}
      />
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Background" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {t.hero.badge}
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-foreground text-balance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
            >
              {t.hero.title} <br />
              <span className="text-primary">{t.hero.subtitle}</span>
            </motion.h1>

            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              {t.hero.description}
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              <Button 
                size="lg" 
                className="h-12 px-8 text-lg rounded-full font-medium btn-press glow-primary transition-all duration-300" 
                asChild
              >
                <Link href="/onboarding" className="flex items-center gap-2">
                  {t.hero.cta} <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Card Swap */}
      <section id="features" className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="text-4xl font-heading font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Powerful Features for <span className="text-primary">Smart Funding</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Everything you need to navigate the Indian startup funding ecosystem
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Features List */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <FeatureItem
                icon={<Bot className="w-8 h-8" />}
                title="AI-Powered RAG Assistant"
                description="Upload your pitch deck, financial statements, or any document. Our AI analyzes and provides contextual funding advice based on your specific situation with real-time insights."
                delay={0}
              />
              <FeatureItem
                icon={<Brain className="w-8 h-8" />}
                title="Smart Document Analysis"
                description="Advanced AI processes your business documents, extracting key metrics, identifying strengths and weaknesses, and providing actionable recommendations for improvement."
                delay={0.1}
              />
              <FeatureItem
                icon={<TrendingUp className="w-8 h-8" />}
                title="Market Intelligence Hub"
                description="Real-time funding data for FinTech, SaaS, HealthTech, and more. Track trends, average ticket sizes, success rates, and investor preferences in your sector."
                delay={0.2}
              />
              <FeatureItem
                icon={<Users className="w-8 h-8" />}
                title="Investor Matching Engine"
                description="Connect with 500+ active Indian investors. Advanced filtering by stage, sector, ticket size, location, and investment thesis. Get verified contact information."
                delay={0.3}
              />
              <FeatureItem
                icon={<Shield className="w-8 h-8" />}
                title="Government Schemes Database"
                description="Access 50+ central and state funding schemes. Real-time eligibility checking, application tracking, and deadline notifications. Never miss opportunities."
                delay={0.4}
              />
              <FeatureItem
                icon={<Globe className="w-8 h-8" />}
                title="Multilingual Support"
                description="Get complex financial advice in Hindi, Tamil, Telugu, or English. AI explains technical concepts in simple terms, making funding accessible to all founders."
                delay={0.5}
              />
              <FeatureItem
                icon={<BarChart3 className="w-8 h-8" />}
                title="Performance Analytics"
                description="Track your funding journey with detailed analytics. Monitor application progress, investor engagement, and success metrics with actionable insights."
                delay={0.6}
              />
              <FeatureItem
                icon={<Lightbulb className="w-8 h-8" />}
                title="Strategic Recommendations"
                description="Get personalized 7-day action plans based on your startup's stage, sector, and goals. AI-generated strategies tailored to Indian market dynamics."
                delay={0.7}
              />
            </motion.div>

            {/* Card Swap Animation */}
            <div className="relative flex items-center justify-center" style={{ height: '600px' }}>
              <CardSwap
                width={400}
                height={300}
                cardDistance={60}
                verticalDistance={70}
                delay={4000}
                pauseOnHover={true}
                easing="elastic"
              >
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-2xl shadow-2xl border-0">
                  <div className="flex items-center gap-3 mb-4">
                    <Bot className="w-8 h-8" />
                    <h3 className="text-xl font-bold">RAG Assistant</h3>
                  </div>
                  <p className="text-blue-100">Upload documents and get instant AI-powered funding advice tailored to your startup.</p>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-2xl shadow-2xl border-0">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-8 h-8" />
                    <h3 className="text-xl font-bold">Venture Validator</h3>
                  </div>
                  <p className="text-purple-100">Comprehensive assessment with detailed scoring and actionable improvement recommendations.</p>
                </Card>
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-2xl shadow-2xl border-0">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-8 h-8" />
                    <h3 className="text-xl font-bold">Market Insights</h3>
                  </div>
                  <p className="text-green-100">Real-time funding data and trends across all major Indian startup sectors.</p>
                </Card>
                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-2xl shadow-2xl border-0">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-8 h-5" />
                    <h3 className="text-xl font-bold">Investor Network</h3>
                  </div>
                  <p className="text-orange-100">Connect with 500+ verified investors with detailed profiles and contact information.</p>
                </Card>
              </CardSwap>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-heading font-bold mb-4">How Nivesh.ai Works</h2>
            <p className="text-muted-foreground">Three simple steps to unlock your funding potential.</p>
          </div>

          <motion.div 
            ref={stepsRef}
            className="grid md:grid-cols-3 gap-12 relative"
            variants={containerVariants}
            initial="hidden"
            animate={stepsRevealed ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants}>
              <Step 
                number="01" 
                title="Profile Setup" 
                description="Tell us about your startup stage, sector, and location in 2 minutes." 
              />
            </motion.div>
            <div className="hidden md:block absolute top-12 left-1/3 w-1/3 border-t-2 border-dashed border-muted-foreground/20 -z-10" />
            <motion.div variants={itemVariants}>
              <Step 
                number="02" 
                title="AI Assessment" 
                description="Our engine analyzes your data against thousands of successful deals." 
              />
            </motion.div>
            <div className="hidden md:block absolute top-12 left-2/3 w-1/3 border-t-2 border-dashed border-muted-foreground/20 -z-10" />
            <motion.div variants={itemVariants}>
              <Step 
                number="03" 
                title="Strategic Roadmap" 
                description="Receive a tailored funding strategy and connect with the right investors." 
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FeatureItem({ icon, title, description, delay }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  delay: number;
}) {
  return (
    <motion.div 
      className="flex gap-4 group"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="text-center relative bg-background md:bg-transparent p-6 rounded-xl card-hover group cursor-default transition-all duration-300">
      <div className="w-16 h-16 mx-auto bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-xl font-bold mb-6 shadow-xl shadow-primary/20 group-hover:shadow-2xl group-hover:shadow-primary/30 transition-all duration-300">
        {number}
      </div>
      <h3 className="text-xl font-heading font-bold mb-3 transition-smooth">{title}</h3>
      <p className="text-muted-foreground group-hover:text-muted-foreground/80 transition-smooth">{description}</p>
    </div>
  );
}
