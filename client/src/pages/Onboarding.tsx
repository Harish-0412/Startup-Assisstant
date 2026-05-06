import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Check, ChevronRight, ChevronLeft, AlertCircle, Upload, File as FileIcon, X } from "lucide-react";
import { saveFounderProfile } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { translations } from "@/lib/translations";

const formSchema = z.object({
  stage: z.enum(['Idea', 'MVP', 'Revenue', 'Growth'], { required_error: "Please select a stage" }),
  sector: z.string().min(2, "Sector is required"),
  location: z.string().min(2, "Location is required"),
  fundingGoal: z.enum(['Grant', 'Angel', 'VC'], { required_error: "Please select a goal" }),
  language: z.enum(['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Urdu', 'Kannada', 'Malayalam', 'Odia', 'Assamese', 'Sanskrit'], { required_error: "Please select a language" }),
  // Enhanced personalized fields
  companyName: z.string().min(2, "Company name is required"),
  founderName: z.string().min(2, "Your name is required"),
  teamSize: z.enum(['Solo', '2-3', '4-10', '10+'], { required_error: "Please select team size" }),
  monthlyRevenue: z.enum(['Pre-revenue', '<1L', '1-10L', '10L+'], { required_error: "Please select revenue range" }),
  fundingAmount: z.string().min(1, "Funding amount is required"),
  useCase: z.string().min(10, "Please describe your use case (minimum 10 characters)"),
  challenges: z.array(z.string()).min(1, "Please select at least one challenge"),
  // Additional detailed assessment fields
  businessModel: z.enum(['B2B', 'B2C', 'B2B2C', 'Marketplace'], { required_error: "Please select business model" }),
  customerBase: z.enum(['0-10', '10-100', '100-1000', '1000+'], { required_error: "Please select customer base" }),
  competitiveAdvantage: z.string().min(10, "Please describe your competitive advantage"),
  marketSize: z.enum(['<100Cr', '100-1000Cr', '1000-10000Cr', '10000Cr+'], { required_error: "Please select market size" }),
  fundingHistory: z.enum(['None', 'Bootstrapped', 'Friends & Family', 'Angel', 'VC'], { required_error: "Please select funding history" }),
  burnRate: z.enum(['<50K', '50K-2L', '2L-10L', '10L+'], { required_error: "Please select monthly burn rate" }),
  runway: z.enum(['<6 months', '6-12 months', '12-24 months', '24+ months'], { required_error: "Please select runway" }),
  keyMetrics: z.string().min(10, "Please share your key business metrics"),
});

type FormData = z.infer<typeof formSchema>;

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();
  const { profile, updateProfile } = useApp();
  const t = translations[profile.language as keyof typeof translations] || translations.English;

  // Update translations when language changes
  useEffect(() => {
    // Force component re-render when language changes
  }, [profile.language]);

  const onboardingDefaults = {
    basics: {
      title: 'Company Basics',
      description: 'Provide basic information about your company.',
      stage: 'Stage',
      sector: 'Sector',
      sectorPlaceholder: 'Select your sector',
    },
    buttons: {
      back: 'Back',
      next: 'Next',
      generate: 'Generate Dashboard'
    },
    documents: {
      title: 'Documents',
      description: 'Upload your documents (optional)',
      uploadText: 'Click to upload or drag and drop',
      uploadHint: 'PDF, DOC, DOCX up to 10MB'
    }
  };

  const tOnboarding = { ...onboardingDefaults, ...t.onboarding };

  const steps = [
    { id: 'basics', title: 'Company Basics' },
    { id: 'personal', title: 'Personal Info' },
    { id: 'business', title: 'Business Details' },
    { id: 'market', title: 'Market & Competition' },
    { id: 'funding', title: 'Funding Goals' },
    { id: 'financial', title: 'Financial Health' },
    { id: 'challenges', title: 'Challenges & Use Case' },
    { id: 'documents', title: 'Documents' }
  ];
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stage: profile.stage as any || undefined,
      sector: profile.sector || "",
      location: profile.location || "",
      fundingGoal: profile.fundingGoal as any || undefined,
      language: profile.language || "English",
      companyName: "",
      founderName: "",
      teamSize: undefined,
      monthlyRevenue: undefined,
      fundingAmount: "",
      useCase: "",
      challenges: [],
      // Additional fields
      businessModel: undefined,
      customerBase: undefined,
      competitiveAdvantage: "",
      marketSize: undefined,
      fundingHistory: undefined,
      burnRate: undefined,
      runway: undefined,
      keyMetrics: ""
    },
    mode: "onChange" 
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const backendProfile = {
        startup_stage: data.stage.toLowerCase(),
        sector: data.sector.toLowerCase(),
        location: data.location,
        funding_goal: data.fundingGoal.toLowerCase(),
        preferred_language: data.language.toLowerCase(),
        documents: uploadedFiles
      };
      
      await saveFounderProfile(backendProfile);
      updateProfile({ ...data, onboardingCompleted: true, assessmentCompleted: true });
      toast({
        title: "Profile saved successfully!",
        description: "Redirecting to your dashboard..."
      });
      setTimeout(() => {
        setLocation("/dashboard");
      }, 1000);
    } catch (error) {
      console.error('Error saving profile:', error);
      updateProfile({ ...data, onboardingCompleted: true, assessmentCompleted: true });
      toast({
        title: "Profile saved locally",
        description: "Redirecting to your dashboard..."
      });
      setTimeout(() => {
        setLocation("/dashboard");
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fields);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const getFieldsForStep = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 0: return ['stage', 'sector'];
      case 1: return ['founderName', 'companyName', 'location', 'language'];
      case 2: return ['teamSize', 'monthlyRevenue'];
      case 3: return ['businessModel', 'customerBase', 'competitiveAdvantage', 'marketSize'];
      case 4: return ['fundingGoal', 'fundingAmount'];
      case 5: return ['fundingHistory', 'burnRate', 'runway', 'keyMetrics'];
      case 6: return ['challenges', 'useCase'];
      default: return [];
    }
  };

  const challengeOptions = [
    'Finding the right investors',
    'Preparing pitch deck',
    'Financial projections',
    'Legal documentation',
    'Market validation',
    'Team building',
    'Product development',
    'Go-to-market strategy',
    'Regulatory compliance',
    'Scaling operations'
  ];

  const toggleChallenge = (challenge: string) => {
    const updated = selectedChallenges.includes(challenge)
      ? selectedChallenges.filter(c => c !== challenge)
      : [...selectedChallenges, challenge];
    setSelectedChallenges(updated);
    form.setValue('challenges', updated);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {steps.map((step, index) => (
              <motion.div 
                key={step.id} 
                className="flex flex-col items-center flex-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-all duration-300
                    ${index <= currentStep ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' : 'bg-muted text-muted-foreground'}
                  `}
                  whileHover={index <= currentStep ? { scale: 1.1 } : {}}
                >
                  {index < currentStep ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    index + 1
                  )}
                </motion.div>
                <span className={`text-xs font-medium transition-all duration-300 ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Card className="p-8 border-none shadow-xl card-hover">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl font-heading font-bold">{t.onboarding?.basics?.title || tOnboarding.basics.title}</h2>
                      <p className="text-muted-foreground">{t.onboarding?.basics?.description || tOnboarding.basics.description}</p>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">{t.onboarding?.basics?.stage || tOnboarding.basics.stage}</Label>
                      <RadioGroup 
                        onValueChange={(val) => form.setValue("stage", val as any)} 
                        defaultValue={form.getValues("stage")}
                        className="grid grid-cols-2 gap-4"
                      >
                        {['Idea', 'MVP', 'Revenue', 'Growth'].map((stage, idx) => (
                          <motion.div 
                            key={stage}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <RadioGroupItem value={stage} id={stage} className="peer sr-only" />
                            <motion.label
                              htmlFor={stage}
                              className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all card-hover"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="font-semibold">{stage}</span>
                            </motion.label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                      {form.formState.errors.stage && <p className="text-destructive text-sm">{form.formState.errors.stage.message}</p>}
                    </div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="sector">{t.onboarding?.basics?.sector || tOnboarding.basics.sector}</Label>
                      <Select 
                        onValueChange={(val) => form.setValue("sector", val)}
                        defaultValue={form.getValues("sector")}
                      >
                        <SelectTrigger className="focus-ring-premium">
                          <SelectValue placeholder={t.onboarding?.basics?.sectorPlaceholder || tOnboarding.basics.sectorPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SaaS">SaaS / B2B Software</SelectItem>
                          <SelectItem value="Fintech">FinTech</SelectItem>
                          <SelectItem value="Agritech">AgriTech</SelectItem>
                          <SelectItem value="Healthtech">HealthTech</SelectItem>
                          <SelectItem value="Edtech">EdTech</SelectItem>
                          <SelectItem value="D2C">D2C / Consumer</SelectItem>
                          <SelectItem value="Deeptech">DeepTech / AI</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.sector && <p className="text-destructive text-sm">{form.formState.errors.sector.message}</p>}
                    </motion.div>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl font-heading font-bold">Personal Information</h2>
                      <p className="text-muted-foreground">Tell us about yourself and your company</p>
                    </div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Label htmlFor="founderName">Your Name</Label>
                      <Input 
                        id="founderName" 
                        placeholder="Enter your full name" 
                        className="input-glow focus-ring-premium"
                        {...form.register("founderName")}
                      />
                      {form.formState.errors.founderName && <p className="text-destructive text-sm">{form.formState.errors.founderName.message}</p>}
                    </motion.div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input 
                        id="companyName" 
                        placeholder="Enter your company/startup name" 
                        className="input-glow focus-ring-premium"
                        {...form.register("companyName")}
                      />
                      {form.formState.errors.companyName && <p className="text-destructive text-sm">{form.formState.errors.companyName.message}</p>}
                    </motion.div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        placeholder="City, State (e.g., Bangalore, Karnataka)" 
                        className="input-glow focus-ring-premium"
                        {...form.register("location")}
                      />
                      {form.formState.errors.location && <p className="text-destructive text-sm">{form.formState.errors.location.message}</p>}
                    </motion.div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <Label htmlFor="language">Preferred Language</Label>
                      <Select 
                        onValueChange={(val: any) => {
                          form.setValue("language", val);
                          updateProfile({ language: val });
                          // Force re-render by updating the component state
                          window.location.reload();
                        }}
                        defaultValue={form.getValues("language")}
                      >
                        <SelectTrigger className="focus-ring-premium">
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Hindi">Hindi (हिंदी)</SelectItem>
                          <SelectItem value="Tamil">Tamil (தமிழ்)</SelectItem>
                          <SelectItem value="Telugu">Telugu (తెలుగు)</SelectItem>
                          <SelectItem value="Bengali">Bengali (বাংলা)</SelectItem>
                          <SelectItem value="Marathi">Marathi (मराठी)</SelectItem>
                          <SelectItem value="Gujarati">Gujarati (ગુજરાતી)</SelectItem>
                          <SelectItem value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</SelectItem>
                          <SelectItem value="Urdu">Urdu (اردو)</SelectItem>
                          <SelectItem value="Kannada">Kannada (ಕನ್ನಡ)</SelectItem>
                          <SelectItem value="Malayalam">Malayalam (മലയാളം)</SelectItem>
                          <SelectItem value="Odia">Odia (ଓଡ଼ିଆ)</SelectItem>
                          <SelectItem value="Assamese">Assamese (অসমীয়া)</SelectItem>
                          <SelectItem value="Sanskrit">Sanskrit (संस्कृत)</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl font-heading font-bold">Business Details</h2>
                      <p className="text-muted-foreground">Help us understand your business better</p>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">Team Size</Label>
                      <RadioGroup 
                        onValueChange={(val) => form.setValue("teamSize", val as any)} 
                        defaultValue={form.getValues("teamSize")}
                        className="grid grid-cols-2 gap-4"
                      >
                        {['Solo', '2-3', '4-10', '10+'].map((size, idx) => (
                          <motion.div 
                            key={size}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <RadioGroupItem value={size} id={`team-${size}`} className="peer sr-only" />
                            <motion.label
                              htmlFor={`team-${size}`}
                              className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all card-hover"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="font-semibold">{size}</span>
                              <span className="text-xs text-muted-foreground mt-1">
                                {size === 'Solo' ? 'Just me' : 
                                 size === '2-3' ? 'Small team' :
                                 size === '4-10' ? 'Growing team' : 'Large team'}
                              </span>
                            </motion.label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                      {form.formState.errors.teamSize && <p className="text-destructive text-sm">{form.formState.errors.teamSize.message}</p>}
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">Monthly Revenue</Label>
                      <RadioGroup 
                        onValueChange={(val) => form.setValue("monthlyRevenue", val as any)} 
                        defaultValue={form.getValues("monthlyRevenue")}
                        className="grid grid-cols-2 gap-4"
                      >
                        {[
                          { id: 'Pre-revenue', label: 'Pre-revenue', desc: 'No revenue yet' },
                          { id: '<1L', label: '< ₹1 Lakh', desc: 'Early traction' },
                          { id: '1-10L', label: '₹1-10 Lakh', desc: 'Growing revenue' },
                          { id: '10L+', label: '₹10+ Lakh', desc: 'Established revenue' }
                        ].map((revenue, idx) => (
                          <motion.div 
                            key={revenue.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <RadioGroupItem value={revenue.id} id={`revenue-${revenue.id}`} className="peer sr-only" />
                            <motion.label
                              htmlFor={`revenue-${revenue.id}`}
                              className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all card-hover"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="font-semibold">{revenue.label}</span>
                              <span className="text-xs text-muted-foreground mt-1">{revenue.desc}</span>
                            </motion.label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                      {form.formState.errors.monthlyRevenue && <p className="text-destructive text-sm">{form.formState.errors.monthlyRevenue.message}</p>}
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl font-heading font-bold">Market & Competition</h2>
                      <p className="text-muted-foreground">Help us understand your market position</p>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">Business Model</Label>
                      <RadioGroup 
                        onValueChange={(val) => form.setValue("businessModel", val as any)} 
                        defaultValue={form.getValues("businessModel")}
                        className="grid grid-cols-2 gap-4"
                      >
                        {[
                          { id: 'B2B', label: 'B2B', desc: 'Business to Business' },
                          { id: 'B2C', label: 'B2C', desc: 'Business to Consumer' },
                          { id: 'B2B2C', label: 'B2B2C', desc: 'Business to Business to Consumer' },
                          { id: 'Marketplace', label: 'Marketplace', desc: 'Multi-sided platform' }
                        ].map((model, idx) => (
                          <motion.div 
                            key={model.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <RadioGroupItem value={model.id} id={`model-${model.id}`} className="peer sr-only" />
                            <motion.label
                              htmlFor={`model-${model.id}`}
                              className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all card-hover"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="font-semibold">{model.label}</span>
                              <span className="text-xs text-muted-foreground mt-1">{model.desc}</span>
                            </motion.label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                      {form.formState.errors.businessModel && <p className="text-destructive text-sm">{form.formState.errors.businessModel.message}</p>}
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">Customer Base Size</Label>
                      <RadioGroup 
                        onValueChange={(val) => form.setValue("customerBase", val as any)} 
                        defaultValue={form.getValues("customerBase")}
                        className="grid grid-cols-2 gap-4"
                      >
                        {[
                          { id: '0-10', label: '0-10', desc: 'Early validation' },
                          { id: '10-100', label: '10-100', desc: 'Initial traction' },
                          { id: '100-1000', label: '100-1000', desc: 'Growing base' },
                          { id: '1000+', label: '1000+', desc: 'Established base' }
                        ].map((base, idx) => (
                          <motion.div 
                            key={base.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <RadioGroupItem value={base.id} id={`base-${base.id}`} className="peer sr-only" />
                            <motion.label
                              htmlFor={`base-${base.id}`}
                              className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all card-hover"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="font-semibold">{base.label}</span>
                              <span className="text-xs text-muted-foreground mt-1">{base.desc}</span>
                            </motion.label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                      {form.formState.errors.customerBase && <p className="text-destructive text-sm">{form.formState.errors.customerBase.message}</p>}
                    </div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label htmlFor="competitiveAdvantage">Competitive Advantage</Label>
                      <textarea 
                        id="competitiveAdvantage" 
                        placeholder="What makes your solution unique? What's your competitive moat?" 
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[80px] resize-none"
                        {...form.register("competitiveAdvantage")}
                      />
                      {form.formState.errors.competitiveAdvantage && <p className="text-destructive text-sm">{form.formState.errors.competitiveAdvantage.message}</p>}
                    </motion.div>

                    <div className="space-y-4">
                      <Label className="text-base">Total Addressable Market (TAM)</Label>
                      <RadioGroup 
                        onValueChange={(val) => form.setValue("marketSize", val as any)} 
                        defaultValue={form.getValues("marketSize")}
                        className="grid grid-cols-2 gap-4"
                      >
                        {[
                          { id: '<100Cr', label: '< ₹100 Cr', desc: 'Niche market' },
                          { id: '100-1000Cr', label: '₹100-1000 Cr', desc: 'Medium market' },
                          { id: '1000-10000Cr', label: '₹1000-10000 Cr', desc: 'Large market' },
                          { id: '10000Cr+', label: '₹10000+ Cr', desc: 'Massive market' }
                        ].map((market, idx) => (
                          <motion.div 
                            key={market.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <RadioGroupItem value={market.id} id={`market-${market.id}`} className="peer sr-only" />
                            <motion.label
                              htmlFor={`market-${market.id}`}
                              className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all card-hover"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="font-semibold">{market.label}</span>
                              <span className="text-xs text-muted-foreground mt-1">{market.desc}</span>
                            </motion.label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                      {form.formState.errors.marketSize && <p className="text-destructive text-sm">{form.formState.errors.marketSize.message}</p>}
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl font-heading font-bold">Funding Goals</h2>
                      <p className="text-muted-foreground">What type of funding are you looking for?</p>
                    </div>

                    <div className="space-y-4">
                      <RadioGroup 
                        onValueChange={(val) => form.setValue("fundingGoal", val as any)} 
                        defaultValue={form.getValues("fundingGoal")}
                        className="grid gap-4"
                      >
                        {[
                          { id: 'Grant', title: 'Government Grants', desc: 'Non-dilutive funding from government schemes' },
                          { id: 'Angel', title: 'Angel Investment', desc: '₹25L - ₹2Cr from individual investors' },
                          { id: 'VC', title: 'Venture Capital', desc: '₹2Cr+ from institutional investors' }
                        ].map((item, idx) => (
                          <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <RadioGroupItem value={item.id} id={item.id} className="peer sr-only" />
                            <motion.label
                              htmlFor={item.id}
                              className="flex items-center space-x-4 rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all card-hover"
                              whileHover={{ scale: 1.01, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex-1">
                                <p className="font-semibold text-lg">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                              </div>
                              <motion.div 
                                className="h-6 w-6 rounded-full border border-primary peer-data-[state=checked]:bg-primary"
                                whileHover={{ scale: 1.1 }}
                              />
                            </motion.label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                      {form.formState.errors.fundingGoal && <p className="text-destructive text-sm">{form.formState.errors.fundingGoal.message}</p>}
                    </div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label htmlFor="fundingAmount">Target Funding Amount</Label>
                      <Input 
                        id="fundingAmount" 
                        placeholder="e.g., ₹50 Lakh, ₹2 Crore" 
                        className="input-glow focus-ring-premium"
                        {...form.register("fundingAmount")}
                      />
                      {form.formState.errors.fundingAmount && <p className="text-destructive text-sm">{form.formState.errors.fundingAmount.message}</p>}
                    </motion.div>
                  </motion.div>
                )}

                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl font-heading font-bold">Financial Health</h2>
                      <p className="text-muted-foreground">Help us assess your financial position</p>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">Previous Funding History</Label>
                      <RadioGroup 
                        onValueChange={(val) => form.setValue("fundingHistory", val as any)} 
                        defaultValue={form.getValues("fundingHistory")}
                        className="grid gap-3"
                      >
                        {[
                          { id: 'None', label: 'No previous funding', desc: 'First time raising' },
                          { id: 'Bootstrapped', label: 'Bootstrapped', desc: 'Self-funded so far' },
                          { id: 'Friends & Family', label: 'Friends & Family', desc: 'Informal funding' },
                          { id: 'Angel', label: 'Angel Investment', desc: 'Professional angels' },
                          { id: 'VC', label: 'Venture Capital', desc: 'Institutional funding' }
                        ].map((history, idx) => (
                          <motion.div 
                            key={history.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <RadioGroupItem value={history.id} id={`history-${history.id}`} className="peer sr-only" />
                            <motion.label
                              htmlFor={`history-${history.id}`}
                              className="flex items-center space-x-4 rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all card-hover"
                              whileHover={{ scale: 1.01, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex-1">
                                <p className="font-semibold">{history.label}</p>
                                <p className="text-sm text-muted-foreground">{history.desc}</p>
                              </div>
                            </motion.label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                      {form.formState.errors.fundingHistory && <p className="text-destructive text-sm">{form.formState.errors.fundingHistory.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Label className="text-base">Monthly Burn Rate</Label>
                        <RadioGroup 
                          onValueChange={(val) => form.setValue("burnRate", val as any)} 
                          defaultValue={form.getValues("burnRate")}
                          className="grid gap-3"
                        >
                          {[
                            { id: '<50K', label: '< ₹50K' },
                            { id: '50K-2L', label: '₹50K - ₹2L' },
                            { id: '2L-10L', label: '₹2L - ₹10L' },
                            { id: '10L+', label: '₹10L+' }
                          ].map((burn, idx) => (
                            <motion.div 
                              key={burn.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              <RadioGroupItem value={burn.id} id={`burn-${burn.id}`} className="peer sr-only" />
                              <motion.label
                                htmlFor={`burn-${burn.id}`}
                                className="flex items-center justify-center rounded-xl border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all card-hover"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <span className="font-semibold text-sm">{burn.label}</span>
                              </motion.label>
                            </motion.div>
                          ))}
                        </RadioGroup>
                        {form.formState.errors.burnRate && <p className="text-destructive text-sm">{form.formState.errors.burnRate.message}</p>}
                      </div>

                      <div className="space-y-4">
                        <Label className="text-base">Current Runway</Label>
                        <RadioGroup 
                          onValueChange={(val) => form.setValue("runway", val as any)} 
                          defaultValue={form.getValues("runway")}
                          className="grid gap-3"
                        >
                          {[
                            { id: '<6 months', label: '< 6 months' },
                            { id: '6-12 months', label: '6-12 months' },
                            { id: '12-24 months', label: '12-24 months' },
                            { id: '24+ months', label: '24+ months' }
                          ].map((runway, idx) => (
                            <motion.div 
                              key={runway.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              <RadioGroupItem value={runway.id} id={`runway-${runway.id}`} className="peer sr-only" />
                              <motion.label
                                htmlFor={`runway-${runway.id}`}
                                className="flex items-center justify-center rounded-xl border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all card-hover"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <span className="font-semibold text-sm">{runway.label}</span>
                              </motion.label>
                            </motion.div>
                          ))}
                        </RadioGroup>
                        {form.formState.errors.runway && <p className="text-destructive text-sm">{form.formState.errors.runway.message}</p>}
                      </div>
                    </div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Label htmlFor="keyMetrics">Key Business Metrics</Label>
                      <textarea 
                        id="keyMetrics" 
                        placeholder="Share your key metrics: CAC, LTV, MRR, churn rate, growth rate, etc." 
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[100px] resize-none"
                        {...form.register("keyMetrics")}
                      />
                      {form.formState.errors.keyMetrics && <p className="text-destructive text-sm">{form.formState.errors.keyMetrics.message}</p>}
                    </motion.div>
                  </motion.div>
                )}

                {currentStep === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl font-heading font-bold">Challenges & Use Case</h2>
                      <p className="text-muted-foreground">Help us understand your specific needs</p>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">What challenges are you facing? (Select all that apply)</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {challengeOptions.map((challenge, idx) => (
                          <motion.div
                            key={challenge}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedChallenges.includes(challenge)
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-muted hover:border-primary/50'
                            }`}
                            onClick={() => toggleChallenge(challenge)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="text-sm font-medium">{challenge}</span>
                          </motion.div>
                        ))}
                      </div>
                      {form.formState.errors.challenges && <p className="text-destructive text-sm">{form.formState.errors.challenges.message}</p>}
                    </div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Label htmlFor="useCase">How do you plan to use StartupHub?</Label>
                      <textarea 
                        id="useCase" 
                        placeholder="Describe your specific use case, what you hope to achieve, and how StartupHub can help you..." 
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[100px] resize-none"
                        {...form.register("useCase")}
                      />
                      {form.formState.errors.useCase && <p className="text-destructive text-sm">{form.formState.errors.useCase.message}</p>}
                    </motion.div>
                  </motion.div>
                )}

                {currentStep === 7 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl font-heading font-bold">{t.onboarding?.documents?.title || tOnboarding.documents.title}</h2>
                      <p className="text-muted-foreground">{t.onboarding?.documents?.description || tOnboarding.documents.description}</p>
                    </div>

                    <div 
                      className="border-2 border-dashed border-muted rounded-xl p-8 flex flex-col items-center justify-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        multiple 
                        accept=".pdf,.doc,.docx" 
                        onChange={handleFileChange}
                      />
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{t.onboarding?.documents?.uploadText || tOnboarding.documents.uploadText}</p>
                        <p className="text-xs text-muted-foreground">{t.onboarding?.documents?.uploadHint || tOnboarding.documents.uploadHint}</p>
                      </div>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        {uploadedFiles.map((file, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border"
                          >
                            <div className="flex items-center gap-3">
                              <FileIcon className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(idx);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div 
                className="flex justify-between mt-8 pt-6 border-t"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={currentStep === 0}
                  className="transition-all duration-200"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> {t.onboarding?.buttons?.back || tOnboarding.buttons.back}
                </Button>
                
                {currentStep === steps.length - 1 ? (
                  <Button 
                    type="submit" 
                    className="px-8 btn-press glow-primary transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : (t.onboarding?.buttons?.generate || tOnboarding.buttons.generate)} <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={nextStep} 
                    className="px-8 btn-press glow-primary transition-all duration-300"
                  >
                    {t.onboarding?.buttons?.next || tOnboarding.buttons.next} <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </motion.div>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
