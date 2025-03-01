import { RiHome3Line, RiEmotionLaughLine, RiFlowChart } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import {
  TbUniverse,
  TbMessageChatbot,
  TbReportAnalytics,
} from "react-icons/tb";

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
    category: "user",
    items: [
      { title: "game-flow", route: "/user/flow", icon: RiFlowChart },
      { title: "news", route: "/user/news", icon: FaRegNewspaper },
      { title: "chatbot", route: "/user/chatbot", icon: TbMessageChatbot },
    ],
  },
];
