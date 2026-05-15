import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, isLoading, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !isLoading && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-end">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading || disabled}
            className="resize-none min-h-[48px] max-h-[150px] bg-muted/50 border-input focus:border-primary transition-colors"
            rows={1}
          />
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading || disabled}
            size="icon"
            className="h-12 w-12 shrink-0 bg-primary hover:bg-primary/90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="mt-3 space-y-1">
          <p className="text-xs text-muted-foreground text-center">
            This assistant provides signposting and guidance. Always verify immigration and legal advice with qualified professionals.
          </p>
          <p className="text-xs text-muted-foreground/80 text-center">
            <span className="text-destructive/80">Disclaimer:</span> General information only. Not legal/medical advice. 
            Emergency: <span className="font-semibold">999</span> | Non-emergency: <span className="font-semibold">NHS 111</span>
          </p>
        </div>
      </div>
    </div>
  );
};
