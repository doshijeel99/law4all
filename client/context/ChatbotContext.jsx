"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const ChatbotContext = createContext(undefined);

export const ChatbotProvider = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const pathParts = pathname.split("/");
  const botFromUrl = pathParts[3];
  const isValidChatbot = ["cb", "ps"].includes(botFromUrl);

  const [currentBot, setCurrentBot] = useState(
    isValidChatbot ? botFromUrl : "cb"
  );

  useEffect(() => {
    if (isValidChatbot && currentBot !== botFromUrl) {
      setCurrentBot(botFromUrl);
    }
  }, [botFromUrl]);

  const updateBot = (newBot) => {
    if (newBot === currentBot) return;

    setCurrentBot(newBot);

    pathParts[3] = newBot;
    router.push(pathParts.join("/"));
  };

  return (
    <ChatbotContext.Provider value={{ currentBot, updateBot }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};
