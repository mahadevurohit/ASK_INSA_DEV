import { useState, useCallback, useEffect } from "react";
import { Message, UserInfo, QuickAction } from "@/types/chat";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CHAT_URL = "/api/chat";

const quickActionMessages: Record<string, string> = {
  join_insa: "I want to join INSA. Please show me the registration link.",
  volunteer: "I'm interested in volunteering with INSA. How can I help?",
  website: "Please share the INSA UK website link.",
  newsletter: "I'd like to read the INSA 2025 newsletter.",
  important_links: "Show me all the important links for Indian students in the UK including UKCISA, High Commission, and other official resources.",
  contact: "How can I contact INSA UK?",
  emergency: "I need emergency help. What should I do?",
  menu: "Show me the main menu with all quick links."
};

// Get or create a session ID for this browser session
const getSessionId = (): string => {
  let sessionId = localStorage.getItem("insa_chat_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("insa_chat_session_id", sessionId);
  }
  return sessionId;
};

export const useChat = (userInfo: UserInfo) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatUserId, setChatUserId] = useState<string | null>(null);

  // Create or get chat user on mount
  useEffect(() => {
    const initChatUser = async () => {
      const sessionId = getSessionId();
      
      try {
        // Check if user already exists (cast to any until types regenerate)
        const { data: existingUser } = await (supabase
          .from("chat_users" as any)
          .select("id")
          .eq("session_id", sessionId)
          .maybeSingle() as any);

        if (existingUser) {
          // Update user info if changed
          await (supabase
            .from("chat_users" as any)
            .update({ 
              name: userInfo.name || null, 
              university: userInfo.university || null 
            })
            .eq("id", existingUser.id) as any);
          setChatUserId(existingUser.id);
        } else {
          // Create new user
          const { data: newUser, error } = await (supabase
            .from("chat_users" as any)
            .insert({
              session_id: sessionId,
              name: userInfo.name || null,
              university: userInfo.university || null
            })
            .select("id")
            .single() as any);

          if (error) {
            console.error("Error creating chat user:", error);
          } else {
            setChatUserId(newUser.id);
          }
        }
      } catch (error) {
        console.error("Error initializing chat user:", error);
      }
    };

    initChatUser();
  }, [userInfo]);

  // Save message to database (cast to any until types regenerate)
  const saveMessage = useCallback(async (role: "user" | "assistant", content: string) => {
    if (!chatUserId) return;

    try {
      await (supabase
        .from("chat_messages" as any)
        .insert({
          user_id: chatUserId,
          role,
          content
        }) as any);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  }, [chatUserId]);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Save user message to database
    saveMessage("user", content);

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          userName: userInfo.name,
          university: userInfo.university
        })
      });

      if (response.status === 429) {
        toast({
          title: "Rate limit exceeded",
          description: "Please wait a moment and try again.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      if (response.status === 402) {
        toast({
          title: "Service temporarily unavailable",
          description: "Please try again later.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      const assistantId = crypto.randomUUID();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const deltaContent = parsed.choices?.[0]?.delta?.content;
            if (deltaContent) {
              assistantContent += deltaContent;
              setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg?.role === "assistant" && lastMsg.id === assistantId) {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [
                  ...prev,
                  {
                    id: assistantId,
                    role: "assistant",
                    content: assistantContent,
                    timestamp: new Date()
                  }
                ];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Save assistant message to database after streaming is complete
      if (assistantContent) {
        saveMessage("assistant", assistantContent);
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, userInfo, saveMessage]);

  const handleQuickAction = useCallback((action: QuickAction) => {
    const message = quickActionMessages[action.action];
    if (message) {
      sendMessage(message);
    }
  }, [sendMessage]);

  const addWelcomeMessage = useCallback(() => {
    const greeting = userInfo.name ? `Hello ${userInfo.name}! ` : "Hello! ";
    const universityNote = userInfo.university 
      ? `I see you're studying at **${userInfo.university}** — I'll provide specific support links for your university when relevant.\n\n` 
      : "";
    
    const welcomeMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: `${greeting}🙏 Welcome to the **INSA UK Student Support Assistant**!

${universityNote}I'm here to help you navigate your student journey in the UK. Here's how I can assist:

**What I can help with:**
• **INSA UK** — Join our community, volunteer opportunities, newsletter
• **Official Resources** — UKCISA, High Commission of India, British Council
• **University Support** — Direct links to your university's International Student Support & Students' Union
• **Important Contacts** — Emergency services, education contacts

**Quick Actions:**
Use the buttons above to quickly access common resources, or type your question below.

---
*How can I help you today?*`,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  }, [userInfo]);

  return {
    messages,
    isLoading,
    sendMessage,
    handleQuickAction,
    addWelcomeMessage
  };
};
