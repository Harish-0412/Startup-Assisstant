import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { translations } from "@/lib/translations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function Navbar() {
  const { profile, updateProfile } = useApp();
  const t = translations[profile.language as keyof typeof translations] || translations.English;
  const [showPricing, setShowPricing] = useState(false);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-heading font-bold text-xl tracking-tight text-primary hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            N
          </div>
          Nivesh.ai
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <button 
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="hover:text-foreground transition-colors"
          >
            {t.nav.features}
          </button>
          <button 
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="hover:text-foreground transition-colors"
          >
            {t.nav.howItWorks}
          </button>
          <Link href="/rag" className="hover:text-foreground transition-colors">
            RAG Assistant
          </Link>
          <button 
            onClick={() => setShowPricing(true)}
            className="hover:text-foreground transition-colors"
          >
            {t.nav.pricing}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Select 
            value={profile.language} 
            onValueChange={(val: any) => updateProfile({ language: val })}
          >
            <SelectTrigger className="w-[110px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Hindi">हिंदी (Hindi)</SelectItem>
              <SelectItem value="Tamil">தமிழ் (Tamil)</SelectItem>
              <SelectItem value="Telugu">తెలుగు (Telugu)</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="font-medium" asChild>
            <Link href="/onboarding">
              {t.nav.getStarted}
            </Link>
          </Button>
        </div>
      </div>
      
      <Dialog open={showPricing} onOpenChange={setShowPricing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pricing Information</DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <p className="text-foreground">
                Nivesh.ai is currently in <span className="font-semibold text-primary">pilot phase</span> for early-stage Indian startups.
              </p>
              <p>
                We're offering <span className="font-semibold">free access</span> to selected founders during this period to refine our AI advisor based on real-world feedback.
              </p>
              <p>
                Pricing tiers will be introduced in <span className="font-semibold">Q2 2026</span> based on:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Number of funding advisory sessions</li>
                <li>Document analysis capacity</li>
                <li>Investor matching features</li>
                <li>Priority support</li>
              </ul>
              <p className="text-sm text-muted-foreground pt-2">
                Join now to lock in early access benefits and help shape the product.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowPricing(false)} asChild>
              <Link href="/onboarding">Get Started Free</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
