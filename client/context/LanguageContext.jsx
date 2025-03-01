"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getDictionary } from "@/app/[lang]/dictionaries";
import { usePathname } from "next/navigation";

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  const pathname = usePathname();
  const langFromUrl = pathname.split("/")[1];
  const isValidLang = ["en", "hi", "mr"].includes(langFromUrl);

  const [currentLang, setCurrentLang] = useState(
    isValidLang ? langFromUrl : "en"
  );
  const [dict, setDict] = useState({});

  useEffect(() => {
    if (isValidLang && currentLang !== langFromUrl) {
      setCurrentLang(langFromUrl);
    }
  }, [langFromUrl]);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(currentLang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [currentLang]);

  return (
    <LanguageContext.Provider value={{ currentLang, dict, setCurrentLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
};
