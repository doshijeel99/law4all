import { useLanguage } from "@/context/LanguageContext";
import { Mic, AudioLines } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { Logo } from "@/public/images";
import { CHATBOT_ROUTE } from "@/constants/utils";
import { useChatbot } from "@/context/ChatbotContext";

export const TypingBox = ({
  setMessage,
  loading,
  setLoading,
  setAnimationNumber,
  currentBot,
}) => {
  const [question, setQuestion] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognition = useRef(null);
  const audioRef = useRef(null);
  const { dict } = useLanguage();

  const AnimationTypes = {
    idle: { animation: 2, name: "idle", emoji: "👤" },
    wave: { animation: 12, name: "wave", emoji: "👋" },
    thumbsup: { animation: 9, name: "thumbsup", emoji: "👍" },
    dance: { animation: 0, name: "dance", emoji: "🕺" },
    run: { animation: 6, name: "run", emoji: "🏃" },
  };

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.lang = "en-US";
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onresult = (event) => {
        const speechToText =
          event.results[event.results.length - 1][0].transcript;
        setQuestion(speechToText);
      };

      recognition.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
      };
    } else {
      console.warn("Speech Recognition API is not supported in this browser.");
    }
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    recognition.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognition.current.stop();
  };

  const handleAsk = async () => {
    if (question.trim() === "") {
      toast({
        variant: "destructive",
        title: dict?.chatbot?.empty,
        description: dict?.chatbot?.empty_desc,
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("input", question.trim());
      formData.append("type", currentBot);

      const response = await fetch(CHATBOT_ROUTE, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();

        const assistantReply = result;

        setMessage(assistantReply);

        setQuestion("");
      } else {
        console.error("Request failed with status", response.status);
      }
    } catch (error) {
      console.error("Error fetching audio", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="z-10 w-[620px] flex space-y-6 flex-col bg-gradient-to-tr from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4 backdrop-blur-md rounded-xl border-slate-100/30 border">
      <div>
        <Image src={Logo} alt="bandhu" className="h-7 w-auto" />
        <p className="text-purple-100 font-semibold">{dict?.chatbot?.desc}</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <span className="relative flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-100 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-purple-100"></span>
          </span>
        </div>
      ) : (
        <div className="gap-3 flex items-center">
          <div className="flex gap-4">
            {isRecording ? (
              <button
                className="h-10 w-10 bg-blue-400 p-2 rounded-full text-white flex items-center justify-center gap-x-0.5"
                onClick={stopRecording}
              >
                <div className="line h-1/2 w-1.5 bg-white rounded-xl animate-bounce" />
                <div className="line h-5/6 w-1.5 bg-white rounded-xl animate-bounce delay-100" />
                <div className="line h-3/5 w-1.5 bg-white rounded-xl animate-bounce delay-200" />
                <div className="line h-2/3 w-1.5 bg-white rounded-xl animate-bounce delay-300" />
                <div className="line h-1/2 w-1.5 bg-white rounded-xl animate-bounce delay-400" />
              </button>
            ) : (
              <button
                className="bg-green-400 p-2 rounded-full text-white flex items-center justify-center"
                onClick={startRecording}
              >
                <Mic />
              </button>
            )}
          </div>
          <input
            className="focus:outline focus:outline-white/80 flex-grow bg-slate-800/60 p-2 px-4 rounded-full text-white placeholder:text-white/50 shadow-inner shadow-slate-900/60"
            placeholder={dict?.chatbot?.placeholder}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAsk();
              }
            }}
          />
          <button
            className="bg-slate-100/20 p-2 px-6 rounded-full text-white"
            onClick={handleAsk}
          >
            {dict?.chatbot?.ask}
          </button>
          <audio ref={audioRef} />
        </div>
      )}

      <div className="mt-2 w-full flex gap-3">
        {Object.values(AnimationTypes).map((anim) => (
          <div
            key={anim.name}
            className="flex items-center justify-center gap-2 bg-slate-800/60 p-2 px-4 rounded-full text-white shadow-inner shadow-slate-900/60 hover:cursor-pointer"
            onClick={() => setAnimationNumber(anim.animation)}
          >
            <span className="text-lg">{anim.emoji}</span>
            <span>{dict?.chatbot?.[anim.name]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
