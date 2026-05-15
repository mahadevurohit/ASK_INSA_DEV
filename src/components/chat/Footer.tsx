import { ExternalLink } from "lucide-react";
import { SocialIcons } from "./SocialIcons";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 py-4 px-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2">
          <a
            href="https://www.insauk.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Visit INSA UK Website
          </a>
        </div>
        <SocialIcons />
      </div>
    </footer>
  );
};
