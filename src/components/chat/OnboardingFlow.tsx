import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UserInfo } from "@/types/chat";
import { Heart, GraduationCap, ArrowRight } from "lucide-react";
import { SocialIcons } from "./SocialIcons";

interface OnboardingFlowProps {
  onComplete: (userInfo: UserInfo) => void;
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");

  const handleContinue = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      setStep(2);
    } else {
      onComplete({ name: name || undefined, university: university || undefined });
    }
  };

  const handleSkip = () => {
    onComplete({ name: undefined, university: undefined });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-b from-primary/5 to-background">
      <Card className="max-w-lg w-full p-8 shadow-xl border-primary/20 animate-fade-in">
        {step === 0 && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Namaste! 🙏
              </h1>
              <p className="text-lg text-muted-foreground">
                Welcome to the INSA UK Student Support Assistant
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-left">
              <h2 className="font-semibold text-foreground mb-2">About INSA UK</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                INSA UK, founded in 2016, is a not-for-profit that supports Indian students in the UK, 
                offering a "Home away from Home". It aims to protect student interests and nurture 
                future Indian leaders and ambassadors. INSA promotes Indian culture and ideas, 
                with active chapters in universities across the UK.
              </p>
            </div>
            
            <SocialIcons />
            
            <Button onClick={handleContinue} className="w-full" size="lg">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Let's personalize your experience</h2>
              <p className="text-muted-foreground mt-2">This helps us provide better guidance</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  What's your name?
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name (optional)"
                  className="bg-muted/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Which UK university/college are you studying at?
                </label>
                <Input
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="Enter your university (optional)"
                  className="bg-muted/50"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSkip} className="flex-1">
                Skip
              </Button>
              <Button onClick={handleContinue} className="flex-1">
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Important Disclaimer</h2>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-foreground leading-relaxed font-medium">
                This assistant provides signposting and guidance. Always verify immigration and legal advice with qualified professionals.
              </p>
            </div>

            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-foreground leading-relaxed">
                <span className="font-bold text-destructive">⚠️ Disclaimer:</span> This chatbot provides 
                <span className="font-semibold"> general information and signposting only</span>. 
                It does <span className="font-semibold">NOT</span> provide:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                <li>• Legal or immigration advice</li>
                <li>• Medical advice or diagnosis</li>
                <li>• Mental health counselling</li>
                <li>• Emergency response instructions</li>
              </ul>
            </div>

            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
              <p className="text-sm text-foreground">
                <span className="font-bold text-secondary">🚨 In an emergency:</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Call <span className="font-bold text-destructive">999</span> (or 112) for immediate danger
              </p>
              <p className="text-sm text-muted-foreground">
                Call <span className="font-bold text-secondary">NHS 111</span> for urgent but non-life-threatening
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Privacy:</span> We only use your name and university to personalize guidance. 
                Please do not share sensitive personal data (passport/visa numbers, addresses, bank details, medical details).
              </p>
            </div>

            <Button onClick={handleContinue} className="w-full" size="lg">
              I Understand, Let's Begin
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
