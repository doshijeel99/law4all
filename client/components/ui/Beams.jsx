import React from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import Covers from "./Covers";
import BounceCards from "./BounceCards";
import { Cover } from "./cover";

function Beams() {
  const images = [
    "https://picsum.photos/400/400",
    "https://picsum.photos/500/500",
    "https://picsum.photos/600/600",
    "https://picsum.photos/700/700",
    "https://picsum.photos/300/300",
  ];

  const transformStyles = [
    "rotate(5deg) translate(-150px)",
    "rotate(0deg) translate(-70px)",
    "rotate(-5deg)",
    "rotate(5deg) translate(70px)",
    "rotate(-5deg) translate(150px)",
  ];
  return (
    <BackgroundBeamsWithCollision className="h-screen flex-col gap-20 dark:bg-tan-500">
      <h2 className="text-xl w-full max-w-7xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-golden-300 dark:text-cream font-sans tracking-tight">
        This is a Demo Template for a Next.js project.{" "}
        <Cover>Tagline Here </Cover>
      </h2>
      <div className="] mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
        <BounceCards
          className="custom-bounceCards"
          images={images}
          containerWidth={500}
          containerHeight={250}
          animationDelay={1}
          animationStagger={0.08}
          easeType="elastic.out(1, 0.5)"
          transformStyles={transformStyles}
          enableHover={true}
        />
      </div>
    </BackgroundBeamsWithCollision>
  );
}

export default Beams;
