import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

const socialLinks = [
  { name: "Facebook", icon: Facebook, url: "https://www.facebook.com/INSAUK/", color: "hover:text-[#1877F2]" },
  { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/INSAUKORG/", color: "hover:text-[#E4405F]" },
  { name: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/company/insauk/", color: "hover:text-[#0A66C2]" },
  { name: "YouTube", icon: Youtube, url: "https://www.youtube.com/@insaukorg", color: "hover:text-[#FF0000]" },
  { name: "Twitter", icon: Twitter, url: "https://x.com/INSAUK", color: "hover:text-[#1DA1F2]" },
];

export const SocialIcons = () => {
  return (
    <div className="flex items-center justify-center gap-4">
      <span className="text-sm text-muted-foreground">Follow us:</span>
      <div className="flex gap-3">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            title={social.name}
            className={`p-2 rounded-full bg-muted/50 text-muted-foreground transition-all hover:scale-110 ${social.color}`}
          >
            <social.icon className="h-5 w-5" />
          </a>
        ))}
      </div>
    </div>
  );
};
