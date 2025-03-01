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
    <nav className="z-20 opacity-75 w-full bg-cream dark:bg-tan-800 dark:text-cream shadow-lg fixed top-0 transition-colors duration-300">
      <div className="mx-auto px-10">
        <div className="flex justify-between items-center h-16">
          <Link href={`/${currentLang}`} className="flex items-center">
            <Image
              src={Logo}
              alt="Demo"
              className="h-12 w-auto transition-opacity duration-300 hover:opacity-80"
            />
          </Link>

          <div className="flex items-center justify-between space-x-6">
            <LanguageSwitcher currentLang={currentLang} />
            {/* <ThemeSwitcher toggleTheme={setTheme} />   */}
            <div className="flex items-center space-x-3">
              {isSignedIn ? (
                <Link
                  href={`/${currentLang}/overview`}
                  className="px-4 py-2 rounded-md bg-orange hover:bg-orange-400 text-white font-semibold dark:bg-orange-700 dark:hover:bg-orange-600 transition-colors duration-200"
                >
                  {dict?.home?.goToDash}
                </Link>
              ) : (
                <>
                  <Link
                    href={`/${currentLang}/sign-in`}
                    className="px-4 py-2 rounded-md bg-orange hover:bg-orange-400 text-white font-semibold dark:bg-orange-700 dark:hover:bg-orange-600 transition-colors duration-200"
                  >
                    {dict?.home?.signIn}
                  </Link>
                  <Link
                    href={`/${currentLang}/sign-up`}
                    className="px-4 py-2 rounded-md border border-tan-400 bg-tan bg-opacity-50 hover:bg-tan-200 text-tan-900 font-semibold dark:border-tan-600 dark:bg-tan-700 dark:text-cream dark:hover:bg-tan-600 transition-colors duration-200"
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
