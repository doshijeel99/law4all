"use client";

import { useGlobalState } from "@/context/GlobalContext";
import { useLanguage } from "@/context/LanguageContext";
import { sidebarData } from "@/constants/sidebarData";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/images/logo.png";
import { UserButton, useUser } from "@clerk/nextjs";
import SmallLoader from "./SmallLoader";

const Sidebar = () => {
  const { sidebarState } = useGlobalState();
  const { currentLang, dict } = useLanguage();
  const { user, isLoaded } = useUser();

  return (
    <div className="relative h-screen max-md:hidden">
      <div
        className={`absolute inset-0 bg-gradient-to-br from-cream-500/70 to-cream-300/70 opacity-50 blur-lg -z-10 ${
          sidebarState ? "w-[17rem]" : "w-20"
        }`}
      />

      <div
        className={`h-screen flex flex-col justify-between py-4 bg-cream-100 backdrop-blur-lg ${
          sidebarState ? "w-[17rem] px-2" : "w-20 px-0.5"
        } shadow-xl`}
      >
        <div className="flex flex-col justify-start items-start">
          <div className="flex justify-between items-center mb-2" id="step1">
            <Image
              src={Logo}
              alt="Bandhu Logo"
              className="h-7 w-auto mb-5 tour-logo"
            />
          </div>

          <nav className="px-2">
            {sidebarData.map((category, index) => (
              <div key={index} className="mb-4">
                {sidebarState && (
                  <p className="text-sm font-semibold text-cream-800 uppercase mb-3">
                    {dict?.sidebar?.[category.category] || category.category}
                  </p>
                )}
                <ul>
                  {category.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-center mb-5"
                      id={`${item.title === "chatbot" ? "amigo" : ""}`}
                    >
                      <Link
                        href={`/${currentLang}${item.route}`}
                        className={`flex items-center gap-3 text-golden-500 hover:text-golden-400 hover:font-medium transition ${
                          sidebarState ? "pl-2" : "w-14 justify-center"
                        }`}
                      >
                        <span
                          className={`${
                            sidebarState ? "text-xl" : "text-2xl mb-3"
                          }`}
                        >
                          <item.icon />
                        </span>
                        {sidebarState && (
                          <span className="text-100">
                            {dict?.sidebar?.[item.title]}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {!isLoaded ? (
          <SmallLoader />
        ) : (
          <div
            className={`flex ${
              sidebarState ? "justify-start" : "justify-center"
            } items-center px-2`}
          >
            <UserButton
              afterSignOutUrl={`/${currentLang}`}
              appearance={{
                elements: {
                  userButtonAvatarBox: { height: "40px", width: "40px" },
                },
              }}
            />

            {sidebarState && (
              <div className="flex flex-col justify-center items-start ml-3">
                <h1 className="text-cream-500 font-semibold">
                  {user?.fullName || "User"}
                </h1>
                <h3 className="text-[0.75rem] text-tan-600 -mt-0.5 font-medium">
                  {user?.primaryEmailAddress?.emailAddress || "User email"}
                </h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
