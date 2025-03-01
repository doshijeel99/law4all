import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const LanguageSwitcher = () => {
  const { currentLang, setCurrentLang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी" },
    { code: "mr", name: "मराठी" },
  ];

  const switchLanguage = (lang) => {
    if (lang === currentLang) return;

    setCurrentLang(lang);

    const newPath = pathname.replace(`/${currentLang}`, `/${lang}`);
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            disabled={lang.code === currentLang}
          >
            {lang.name} ({lang.code.toUpperCase()})
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
