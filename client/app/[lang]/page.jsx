"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Heart,
  Users,
  Gamepad2,
  Mail,
  Phone,
  MessageCircle,
  ArrowRight,
  PlayCircle,
  Star,
  Award,
  Sparkles,
} from "lucide-react";
import Waves from "@/components/ui/waves";
import Navbar from "@/components/Home/Navbar";
import Beams from "@/components/ui/Beams";
import { useTheme } from "@/context/ThemeContext";
import AppleCardsCarouselDemo from "@/components/ui/Carousel";
import InfiniteCards from "@/components/ui/MovingCards";

const LandingPage = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-cream-50 to-cream-100 dark:from-orange-900 dark:to-orange-800">
      <Navbar />

      {/* Main content container */}

      {/* Background Elements */}
      <Beams />

      {/* Carousel Section */}

      <AppleCardsCarouselDemo />

      {/* Features Section */}

      <InfiniteCards />

      {/* Wave Section at bottom */}
      <div className="relative z-0">
        <Waves className="text-golden-200 dark:text-orange-700" />
      </div>
    </div>
  );
};

export default LandingPage;
