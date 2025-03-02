import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/public/images";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const MessageBox = ({ message, messageId }) => {
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackSubmit = (type) => {
    // Here you would typically send the feedback to your backend
    console.log({
      messageId,
      feedbackType: type,
      timestamp: new Date().toISOString(),
    });

    setFeedbackType(type);
    setFeedbackSubmitted(true);

    // Reset after delay if needed
    // setTimeout(() => {
    //   setFeedbackSubmitted(false);
    //   setFeedbackType(null);
    // }, 5000);
  };

  const feedbackOptions = [
    {
      id: "helpful",
      icon: <ThumbsUp className="w-4 h-4" />,
      label: "Helpful",
      color: "bg-green-100 hover:bg-green-200 text-green-700 border-green-200",
    },
    {
      id: "not_helpful",
      icon: <ThumbsDown className="w-4 h-4" />,
      label: "Not Helpful",
      color: "bg-red-100 hover:bg-red-200 text-red-700 border-red-200",
    },
    {
      id: "confusing",
      icon: <MessageSquare className="w-4 h-4" />,
      label: "Confusing",
      color:
        "bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-200",
    },
    {
      id: "incorrect",
      icon: <AlertTriangle className="w-4 h-4" />,
      label: "Incorrect",
      color:
        "bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-200",
    },
  ];

  const formatMessage = (text) => {
    if (!text) return null;

    const bulletPointRegex = /^[*-]\s(.+)/gm;
    const numberedListRegex = /^(\d+\.\s)(.+)/gm;

    if (text.includes("🎮")) {
      const gameLines = text.split("\n").filter((line) => line.includes("🎮"));

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {gameLines.map((line, index) => {
            const parts = line.split("🎮");
            const gameName = parts[0].replace(/[•\s]/g, "").trim();
            const gameDescription = parts[1]?.trim() || "";

            return (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="group"
              >
                <Card className="bg-blue-800 border-blue-500 hover:bg-blue-900 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="secondary"
                        className="bg-blue-500/20 text-blue-700 px-3 py-1 text-xl"
                      >
                        {gameName}
                      </Badge>
                      <span className="text-xl group-hover:rotate-12 transition-transform">
                        🎮
                      </span>
                    </div>
                    <p className="text-limeGreen-300 text-md">
                      {gameDescription}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      );
    }

    const bulletPoints = text.matchAll(bulletPointRegex);
    const numberedLists = text.matchAll(numberedListRegex);

    if (Array.from(text.matchAll(bulletPointRegex)).length > 0) {
      const points = Array.from(bulletPoints, (match) => match[1]);
      return (
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="space-y-3"
        >
          {points.map((point, index) => (
            <motion.li
              key={index}
              variants={{
                hidden: { x: -20, opacity: 0 },
                visible: { x: 0, opacity: 1 },
              }}
              className="flex gap-2 text-blue-600 hover:bg-white/10 p-3 rounded-lg transition-all"
            >
              <span className="text-blue-500">•</span>
              <span>{point.trim()}</span>
            </motion.li>
          ))}
        </motion.ul>
      );
    } else if (Array.from(text.matchAll(numberedListRegex)).length > 0) {
      const points = Array.from(numberedLists, (match) => match[2]);
      return (
        <motion.ol
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="space-y-3"
        >
          {points.map((point, index) => (
            <motion.li
              key={index}
              variants={{
                hidden: { x: -20, opacity: 0 },
                visible: { x: 0, opacity: 1 },
              }}
              className="flex gap-2 text-white hover:bg-white/10 p-3 rounded-lg transition-all"
            >
              <Badge
                variant="outline"
                className="h-6 w-6 flex items-center justify-center"
              >
                {index + 1}
              </Badge>
              <span>{point.trim()}</span>
            </motion.li>
          ))}
        </motion.ol>
      );
    }

    return (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-bold text-lg text-limeGreen-900 leading-relaxed whitespace-pre-line tracking-wide hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-blue-500/5"
      >
        {text}
      </motion.p>
    );
  };

  const renderFeedbackUI = () => {
    if (feedbackSubmitted) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-3 mt-4 bg-green-50 rounded-lg border border-green-200"
        >
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Thank you for your feedback!</span>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 border-t border-gray-200 pt-4"
      >
        <div className="text-sm text-gray-500 mb-2">
          Was this response helpful?
        </div>
        <div className="flex flex-wrap gap-2">
          {feedbackOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleFeedbackSubmit(option.id)}
              className={`${option.color} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-all duration-200 border`}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="z-10 h-[500px] w-[900px]"
    >
      <Card className="h-full bg-gradient-to-tr from-white via-white/70 to-white/70 backdrop-blur-md border-white/10">
        {message === "" ? (
          <div className="h-full w-full flex justify-center items-center">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Image src={Logo} alt="amigo.ai" className="h-56 w-auto" />
            </motion.div>
          </div>
        ) : (
          <ScrollArea className="h-full w-full p-6 rounded-lg">
            <div>
              {formatMessage(message)}
              {message && renderFeedbackUI()}
            </div>
          </ScrollArea>
        )}
      </Card>
    </motion.div>
  );
};

export default MessageBox;
