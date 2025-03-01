import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Bot } from "lucide-react";
import { useChatbot } from "@/context/ChatbotContext";
import { useLanguage } from "@/context/LanguageContext";

const ChatbotSwitcher = () => {
  const { currentBot, updateBot } = useChatbot();
  const { dict } = useLanguage();

  return <div></div>;
};

export default ChatbotSwitcher;
