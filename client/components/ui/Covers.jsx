import React from "react";
import { Cover } from "@/components/ui/cover";

function Covers() {
  return (
    <div>
      <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-cream-700 via-cream-500 to-blue-400 dark:from-cream-500 dark:via-blue-300 dark:to-blue-100">
        <Cover>Tagline Here</Cover>
      </h1>
    </div>
  );
}

export default Covers;
