import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

type StartupStage = 'Idea' | 'MVP' | 'Revenue' | 'Growth';
type FundingGoal = 'Grant' | 'Angel' | 'VC';
type Language = 'English' | 'Hindi' | 'Tamil' | 'Telugu' | 'Bengali' | 'Marathi' | 'Gujarati' | 'Punjabi' | 'Urdu' | 'Kannada' | 'Malayalam' | 'Odia' | 'Assamese' | 'Sanskrit';

interface FounderProfile {
  stage: StartupStage | '';
  sector: string;
  location: string;
  fundingGoal: FundingGoal | '';
  language: Language;
  onboardingCompleted: boolean;
  assessmentCompleted: boolean;
  userId?: string;
}

interface AppContextType {
  profile: FounderProfile;
  updateProfile: (data: Partial<FounderProfile>) => void;
  resetProfile: () => void;
  loadUserProfile: (userId: string) => void;
  saveUserProfile: (userId: string, profile: FounderProfile) => void;
}

const defaultProfile: FounderProfile = {
  stage: '',
  sector: '',
  location: '',
  fundingGoal: '',
  language: 'English',
  onboardingCompleted: false,
  assessmentCompleted: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<FounderProfile>(defaultProfile);
  const { currentUser } = useAuth();

  const loadUserProfile = (userId: string) => {
    const savedProfile = localStorage.getItem(`profile_${userId}`);
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);
    } else {
      // Set default with user ID but keep assessment status false
      setProfile({ ...defaultProfile, userId });
    }
  };

  const saveUserProfile = (userId: string, profileData: FounderProfile) => {
    localStorage.setItem(`profile_${userId}`, JSON.stringify(profileData));
  };

  const updateProfile = (data: Partial<FounderProfile>) => {
    const updatedProfile = { ...profile, ...data };
    setProfile(updatedProfile);
    if (currentUser) {
      saveUserProfile(currentUser.uid, updatedProfile);
    }
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
  };

  useEffect(() => {
    if (currentUser) {
      loadUserProfile(currentUser.uid);
    }
    // Don't reset profile on logout to preserve data
  }, [currentUser]);

  return (
    <AppContext.Provider value={{ profile, updateProfile, resetProfile, loadUserProfile, saveUserProfile }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
