import { useEffect, useRef } from "react";
import { Message, UserInfo, QuickAction } from "@/types/chat";
import { MessageItem } from "./MessageItem";
import { ChatInput } from "./ChatInput";
import { QuickActionsMenu } from "./QuickActionsMenu";
import { useChat } from "@/hooks/useChat";

interface ChatContainerProps {
  userInfo: UserInfo;
}

export const ChatContainer = ({ userInfo }: ChatContainerProps) => {
  const { messages, isLoading, sendMessage, handleQuickAction, addWelcomeMessage } = useChat(userInfo);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    addWelcomeMessage();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <QuickActionsMenu onAction={handleQuickAction} />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-3 max-w-[85%]">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
};
