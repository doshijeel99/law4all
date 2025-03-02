"use client";

import { useUser } from "@clerk/clerk-react";
import { Logo } from "@/public/images";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "../Misc/LanguageButton";
import { useLanguage } from "@/context/LanguageContext";
import ThemeSwitcher from "../Misc/ThemeSwitcher";
import { useTheme } from "next-themes";

const Navbar = () => {
  const { isSignedIn } = useUser();
  const { dict, currentLang } = useLanguage();
  // const { theme, setTheme } = useTheme();

  return (
    <nav className="z-20 opacity-75 w-full bg-blue dark:bg-blue-800 dark:text-blue shadow-lg fixed top-0 transition-colors duration-300">
      <div className="mx-auto px-10">
        <div className="flex justify-between items-center h-16">
          <Link href={`/${currentLang}`} className="flex items-center">
            <Image
              src={Logo}
              alt="Demo"
              className="h-22 w-auto transition-opacity duration-300 hover:opacity-80"
            />
          </Link>

          <div className="flex items-center justify-between space-x-6">
            <LanguageSwitcher currentLang={currentLang} />
            {/* <ThemeSwitcher toggleTheme={setTheme} />   */}
            <div className="flex items-center space-x-3">
              {isSignedIn ? (
                <Link
                  href={`/${currentLang}/overview`}
                  className="px-4 py-2 rounded-md bg-cream hover:bg-cream-400 text-white font-semibold dark:bg-cream-700 dark:hover:bg-cream-600 transition-colors duration-200"
                >
                  {dict?.home?.goToDash}
                </Link>
              ) : (
                <>
                  <Link
                    href={`/${currentLang}/sign-in`}
                    className="px-4 py-2 rounded-md bg-cream hover:bg-cream-400 text-white font-semibold dark:bg-cream-700 dark:hover:bg-cream-600 transition-colors duration-200"
                  >
                    {dict?.home?.signIn}
                  </Link>
                  <Link
                    href={`/${currentLang}/sign-up`}
                    className="px-4 py-2 rounded-md border border-blue-400 bg-blue bg-opacity-50 hover:bg-blue-200 text-blue-900 font-semibold dark:border-blue-600 dark:bg-blue-700 dark:text-blue dark:hover:bg-blue-600 transition-colors duration-200"
                  >
                    {dict?.home?.signUp}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
