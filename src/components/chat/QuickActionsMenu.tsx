import { QuickActionCard } from "./QuickActionCard";
import { QuickAction } from "@/types/chat";
import { 
  Users, 
  Heart, 
  Globe, 
  Newspaper, 
  Link, 
  Mail, 
  AlertTriangle 
} from "lucide-react";

interface QuickActionsMenuProps {
  onAction: (action: QuickAction) => void;
}

const quickActions: QuickAction[] = [
  {
    id: "join",
    title: "Join INSA",
    description: "Become a member",
    icon: "Users",
    action: "join_insa"
  },
  {
    id: "volunteer",
    title: "Volunteer",
    description: "Help the community",
    icon: "Heart",
    action: "volunteer"
  },
  {
    id: "website",
    title: "Website",
    description: "Visit INSA UK",
    icon: "Globe",
    action: "website"
  },
  {
    id: "newsletter",
    title: "Newsletter",
    description: "2025 Edition",
    icon: "Newspaper",
    action: "newsletter"
  },
  {
    id: "links",
    title: "Important Links",
    description: "Official resources",
    icon: "Link",
    action: "important_links"
  },
  {
    id: "contact",
    title: "Contact Us",
    description: "Get in touch",
    icon: "Mail",
    action: "contact"
  },
  {
    id: "emergency",
    title: "Emergency",
    description: "Urgent help",
    icon: "AlertTriangle",
    action: "emergency",
    variant: "destructive"
  }
];

const iconMap = {
  Users,
  Heart,
  Globe,
  Newspaper,
  Link,
  Mail,
  AlertTriangle
};

export const QuickActionsMenu = ({ onAction }: QuickActionsMenuProps) => {
  return (
    <div className="p-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {quickActions.map((action) => {
            const IconComponent = iconMap[action.icon as keyof typeof iconMap];
            return (
              <QuickActionCard
                key={action.id}
                title={action.title}
                description={action.description}
                icon={<IconComponent className="h-5 w-5" />}
                onClick={() => onAction(action)}
                variant={action.variant as "default" | "destructive" | undefined}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
