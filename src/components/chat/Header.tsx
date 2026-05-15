import { Shield } from "lucide-react";
import insaLogo from "@/assets/insa-uk-logo.png";

export const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground px-4 py-3 shadow-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={insaLogo} 
            alt="INSA UK Logo" 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h1 className="font-bold text-lg leading-tight">INSA UK</h1>
            <p className="text-xs text-primary-foreground/80">Student Support Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-primary-foreground/80">
          <Shield className="h-4 w-4" />
          <span>Safe & Secure</span>
        </div>
      </div>
    </header>
  );
};
