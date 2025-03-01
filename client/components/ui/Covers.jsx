import React from "react";
import { Cover } from "@/components/ui/cover";

function Covers() {
  return (
    <div>
      <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-orange-700 via-orange-500 to-golden-400 dark:from-orange-500 dark:via-golden-300 dark:to-cream-100">
        <Cover>Tagline Here</Cover>
      </h1>
    </div>
  );
}

export default Covers;
