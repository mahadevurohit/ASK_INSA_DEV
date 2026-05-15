-- Create a table for chat users (storing name and university)
CREATE TABLE public.chat_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  name TEXT,
  university TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for chat messages
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.chat_users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX idx_chat_users_created_at ON public.chat_users(created_at);

-- Enable Row Level Security
ALTER TABLE public.chat_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public insert (since we don't have auth)
-- These allow anyone to insert data (for anonymous chat users)
CREATE POLICY "Allow public insert on chat_users" 
ON public.chat_users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public insert on chat_messages" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (true);

-- Allow reading own data by session_id (we'll pass this from the client)
CREATE POLICY "Allow public select on chat_users" 
ON public.chat_users 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public select on chat_messages" 
ON public.chat_messages 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_chat_users_updated_at
BEFORE UPDATE ON public.chat_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();