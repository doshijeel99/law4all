import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, X } from "lucide-react";
import { Logo } from "@/public/images";
import Image from "next/image";
import Experience from "./Experience";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 text-white shadow-lg"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      ) : (
        <Card
          className={`w-[600px] h-[500px] shadow-xl transition-all duration-300 ease-in-out overflow-hidden relative`}
        >
          <div className="absolute top-0 h-14 p-3 px-5 bg-transparent rounded-t-lg flex justify-between items-center z-50 w-full">
            <span className="font-semibold flex-row-center gap-x-2">
              <Image src={Logo} alt="amigo.ai" className="h-8 w-auto" />{" "}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-red-600 hover:bg-transparent"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Experience />
        </Card>
      )}
    </div>
  );
};

export default FloatingChatbot;
