import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive";
}

export const QuickActionCard = ({
  title,
  description,
  icon,
  onClick,
  variant = "default"
}: QuickActionCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 p-3 rounded-xl transition-all hover:scale-105 active:scale-95",
        "border shadow-sm",
        variant === "destructive"
          ? "bg-destructive/10 border-destructive/30 hover:bg-destructive/20 text-destructive"
          : "bg-card border-border hover:bg-accent text-foreground"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          variant === "destructive" ? "bg-destructive/20" : "bg-primary/10"
        )}
      >
        <span className={variant === "destructive" ? "text-destructive" : "text-primary"}>
          {icon}
        </span>
      </div>
      <span className="text-xs font-medium truncate w-full text-center">{title}</span>
    </button>
  );
};
