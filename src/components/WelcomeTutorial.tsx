'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, Check, Sparkles, Key, Download, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: TutorialStep[] = [
  {
    id: 'add-token',
    title: 'Add Your First Token',
    description: 'Securely store API keys and tokens. All data is encrypted with AES-256-GCM.',
    icon: <Key className="w-8 h-8" />,
  },
  {
    id: 'ai-parse',
    title: 'Use AI Parser',
    description: 'Paste any text containing tokens and let AI extract and categorize them automatically.',
    icon: <Sparkles className="w-8 h-8" />,
  },
  {
    id: 'test-token',
    title: 'Test Token Validity',
    description: 'Verify your tokens are still valid with the built-in test feature.',
    icon: <Shield className="w-8 h-8" />,
  },
  {
    id: 'export',
    title: 'Export Anywhere',
    description: 'Export all your tokens to .env format for easy use in your projects.',
    icon: <Download className="w-8 h-8" />,
  },
];

const STORAGE_KEY = 'tokns_welcome_dismissed';

export function WelcomeTutorial() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if user has dismissed tutorial before
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      // Show tutorial after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    localStorage.setItem(STORAGE_KEY, 'true');
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={cn(
          'absolute inset-0 bg-black/80 transition-opacity duration-300',
          isClosing ? 'opacity-0' : 'opacity-100'
        )}
        onClick={handleSkip}
      />

      {/* Modal */}
      <div className={cn(
        'relative w-full max-w-md mx-4 bg-[#171717] border-2 border-[#404040] p-6 transition-all duration-300',
        isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      )}>
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-1 text-[#737373] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress bar */}
        <div className="w-full h-1 bg-[#262626] mb-6">
          <div 
            className="h-full bg-[#FF9F1C] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-4">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                i <= currentStep ? 'bg-[#FF9F1C]' : 'bg-[#404040]'
              )}
            />
          ))}
        </div>

        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center border-2 border-[#FF9F1C] text-[#FF9F1C]">
          {step.icon}
        </div>

        {/* Content */}
        <h2 className="text-xl font-bold text-center text-white mb-2">
          {step.title}
        </h2>
        <p className="text-[#737373] text-center mb-6">
          {step.description}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 px-4 py-3 border-2 border-[#404040] text-[#737373] font-bold uppercase hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-3 bg-[#FF9F1C] text-black font-bold uppercase border-2 border-[#FF9F1C] hover:bg-transparent hover:text-[#FF9F1C] transition-colors flex items-center justify-center gap-2"
          >
            {isLastStep ? (
              <>
                <Check className="w-4 h-4" />
                Get Started
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
