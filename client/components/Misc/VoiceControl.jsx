"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "../ui/button";
import { Mic } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const VoiceControl = () => {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");
  const { dict, currentLang } = useLanguage();

  useEffect(() => {
    if (
      (typeof window !== "undefined" && "SpeechRecognition" in window) ||
      "webkitSpeechRecognition" in window
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = currentLang || "en";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setTranscript(transcript);
        processCommand(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        setErrorMsg(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setErrorMsg("Speech recognition not supported in this browser");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentLang]);

  const getLanguageForSpeechRecognition = (locale) => {
    const langMap = {
      en: "en",
      hi: "hi",
      mr: "mr",
    };
    return langMap[locale] || "en-US";
  };

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang =
        getLanguageForSpeechRecognition(currentLang);
    }
  }, [currentLang]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setErrorMsg("");
        setIsListening(true);
      } catch (error) {
        setErrorMsg("Could not start speech recognition");
      }
    }
  };

  const processCommand = async (text) => {
    try {
      const response = await fetch("http://localhost:4224/api/voice_command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          language: currentLang,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process command");
      }

      const result = await response.json();

      executeCommand(result);
    } catch (error) {
      setErrorMsg("Error processing command");
      console.error(error);
    }
  };

  const executeCommand = (command) => {
    const currentLanguage = currentLang || "en";
    console.log(command);

    switch (command.action) {
      case "navigate":
        if (command.target) {
          const pathMap = {
            overview: `/${currentLanguage}/overview`,
            recent: `/${currentLanguage}/recent`,
            games: `/${currentLanguage}/games/universe`,
            cognitive: `/${currentLanguage}/games/cognitive`,
            "cognitive games": `/${currentLanguage}/games/cognitive`,
            "number match": `/${currentLanguage}/games/cognitive/number-match`,
            motor: `/${currentLanguage}/games/motor`,
            "motor games": `/${currentLanguage}/games/motor`,
            "music mania": `/${currentLanguage}/games/motor/music-mania`,
            "flappy bird": `/${currentLanguage}/games/motor/flappy-bird`,
            nodulus: `/${currentLanguage}/games/motor/nodulus`,
            emotional: `/${currentLanguage}/games/emotional`,
            "emotional games": `/${currentLanguage}/games/emotional`,
            "color paint": `/${currentLanguage}/games/emotional/color-paint`,
            social: `/${currentLanguage}/games/social`,
            "social games": `/${currentLanguage}/games/social`,
            chatbot: `/${currentLanguage}/games/cb/chatbot`,
            "game flow": `/${currentLanguage}/user/game-flow`,
            news: `/${currentLanguage}/user/news`,
            profile: `/${currentLanguage}/user/profile`,
          };

          const path =
            pathMap[command.target.toLowerCase()] ||
            `/${currentLanguage}/${command.target.toLowerCase()}`;
          router.push(path);
        }
        break;
      case "scroll":
        if (command.target === "down") {
          window.scrollBy({ top: 300, behavior: "smooth" });
        } else if (command.target === "up") {
          window.scrollBy({ top: -300, behavior: "smooth" });
        }
        break;
      case "back":
        router.back();
        break;
      case "refresh":
        window.location.reload();
        break;
      default:
        setErrorMsg("Unknown command");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {(isListening || transcript || errorMsg) && (
        <Card className="bg-white shadow-sm">
          <CardContent className="p-3 text-sm">
            <div className="flex flex-col gap-1">
              {isListening && (
                <p className="text-green-500 font-medium">
                  {dict?.voice?.listening}...
                </p>
              )}
              {transcript && (
                <p className="text-gray-700">
                  <span className="text-gray-500">
                    {dict?.voice?.you_said}:
                  </span>{" "}
                  "{transcript}"
                </p>
              )}
              {errorMsg && <p className="text-red-500">{errorMsg}</p>}
            </div>
          </CardContent>
        </Card>
      )}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleListening}
        className={isListening ? "bg-green-50 border-green-200" : ""}
      >
        <Mic className={`h-4 w-4 ${isListening ? "text-green-500" : ""}`} />
      </Button>
    </div>
  );
};

export default VoiceControl;
