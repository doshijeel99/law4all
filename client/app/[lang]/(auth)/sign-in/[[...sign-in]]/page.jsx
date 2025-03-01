"use client";

import { useLanguage } from "@/context/LanguageContext";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  const { currentLang } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <SignIn
        routing="path"
        path={`/${currentLang}/sign-in`}
        redirectUrl={`/${currentLang}/overview`}
        signUpUrl={`/${currentLang}/sign-up`}
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "rounded-xl",
            headerTitle: "text-2xl font-bold",
            headerSubtitle: "text-gray-500",
            formButtonPrimary: "bg-purple-600 hover:bg-purple-700 w-full",
            socialButtonsBlockButton: "w-full",
            footerActionText: "text-center",
            footerActionLink: "text-purple-600 hover:text-purple-700 ml-1",
          },
        }}
      />
    </div>
  );
}
