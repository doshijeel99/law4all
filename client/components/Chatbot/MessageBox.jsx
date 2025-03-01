import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/public/images";

const MessageBox = ({ message }) => {
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
                <Card className="bg-purple-800 border-purple-500 hover:bg-purple-900 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="secondary"
                        className="bg-purple-500/20 text-purple-100 px-3 py-1 text-xl"
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
              className="flex gap-2 text-purple-600 hover:bg-white/10 p-3 rounded-lg transition-all"
            >
              <span className="text-purple-500">•</span>
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
        className="font-bold text-lg text-limeGreen-900 leading-relaxed whitespace-pre-line tracking-wide hover:text-purple-700 transition-colors duration-300 p-2 rounded-lg hover:bg-purple-500/5"
      >
        {text}
      </motion.p>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="z-10 h-[500px] w-[900px]"
    >
      <Card className="h-full bg-gradient-to-tr from-slate-700/30 via-gray-800/30 to-slate-700-500/30 backdrop-blur-md border-white/10">
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
              <Image src={Logo} alt="amigo.ai" className="h-20 w-auto" />
            </motion.div>
          </div>
        ) : (
          <ScrollArea className="h-full w-full p-6 rounded-lg">
            {formatMessage(message)}
          </ScrollArea>
        )}
      </Card>
    </motion.div>
  );
};

export default MessageBox;
