export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface UserInfo {
  name?: string;
  university?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  variant?: "default" | "destructive";
}

export interface ChatState {
  messages: Message[];
  userInfo: UserInfo | null;
  isLoading: boolean;
  isOnboarded: boolean;
}
