"use client";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "next-themes";

const ThemeSwitcher = ({ toggleTheme }) => {
  const { theme, setTheme } = useTheme();

  const handleTheme = () => {
    toggleTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div>
      <Button onClick={toggleTheme} variant="outline" size="icon">
        {theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default ThemeSwitcher;
