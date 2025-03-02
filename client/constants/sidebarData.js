import { RiHome3Line, RiEmotionLaughLine, RiFlowChart } from "react-icons/ri";
import { SiGoogledocs } from "react-icons/si";

import { TbMessageChatbot, TbReportAnalytics } from "react-icons/tb";

import { LuBrain, LuUserRound } from "react-icons/lu";
import { FaGears, FaRegNewspaper } from "react-icons/fa6";
import { SlPeople } from "react-icons/sl";
import { IoSettingsOutline } from "react-icons/io5";

export const sidebarData = [
  {
    category: "dashboard",
    items: [
      { title: "overview", route: "/overview", icon: RiHome3Line },
      { title: "reports", route: "/reports", icon: TbReportAnalytics },
    ],
  },
  {
    category: "law",
    items: [
      { title: "services", route: "/service", icon: LuUserRound },
      { title: "legal-docs", route: "/docs", icon: SiGoogledocs },
      { title: "maps", route: "/maps", icon: SlPeople },
      { title: "pathway", route: "/pathway", icon: RiFlowChart },
      { title: "chatbot", route: "/chatbot", icon: TbMessageChatbot },
    ],
  },
  {
    category: "user",
    items: [
      { title: "news", route: "/user/news", icon: FaRegNewspaper },
      { title: "settings", route: "/user/settings", icon: IoSettingsOutline },
    ],
  },
];
