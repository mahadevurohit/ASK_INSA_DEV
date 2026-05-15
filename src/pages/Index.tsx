import { useState } from "react";
import { UserInfo } from "@/types/chat";
import { Header } from "@/components/chat/Header";
import { Footer } from "@/components/chat/Footer";
import { OnboardingFlow } from "@/components/chat/OnboardingFlow";
import { ChatContainer } from "@/components/chat/ChatContainer";

const Index = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const handleOnboardingComplete = (info: UserInfo) => {
    setUserInfo(info);
    setIsOnboarded(true);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      
      <div className="flex-1 overflow-hidden">
        {!isOnboarded ? (
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        ) : (
          <ChatContainer userInfo={userInfo!} />
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
