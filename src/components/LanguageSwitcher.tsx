"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Check, ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const languages = [
  { code: "en", label: "English", display: "Eng" },
  { code: "zh", label: "Mandarin", display: "中文" },
  { code: "ar", label: "Arabic", display: "عرب" },
  { code: "ru", label: "Russian", display: "Рус" },
  { code: "th", label: "Thai", display: "ไทย" },
  { code: "es", label: "Spanish", display: "Esp" },
  { code: "fr", label: "French", display: "Fra" },
  { code: "de", label: "German", display: "Deu" },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  // Get canonical current locale directly from next-intl instead of parsing the URL
  const currentLocale = useLocale();

  const handleLanguageChange = (code: string) => {
    // Determine path without current language prefix
    let pathWithoutLocale = pathname;
    if (pathname.startsWith(`/${currentLocale}/`) || pathname === `/${currentLocale}`) {
      pathWithoutLocale = pathname.replace(`/${currentLocale}`, "");
    }
    
    // Default to root if empty
    if (pathWithoutLocale === "") pathWithoutLocale = "/";
    
    // If the selected language is 'en', we strip the prefix completely for cleaner URLs
    const newPath = code === 'en' ? pathWithoutLocale : `/${code}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
    
    // Refresh the router to load new JSON translations
    router.push(newPath);
    router.refresh();
  };

  const activeLang = languages.find((l) => l.code === currentLocale) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2 px-2 text-white bg-transparent hover:bg-slate-800 border-none outline-none focus:ring-0">
          <span className="font-medium">{activeLang.display}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[200px] bg-[#0A101D] border-slate-800 text-slate-200"
      >
        <div className="flex px-3 py-2 border-b border-slate-800 mb-1">
          <span className="text-blue-500 font-medium w-12">{activeLang.display}</span>
          <span className="text-blue-500 font-medium">{activeLang.label}</span>
        </div>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center cursor-pointer hover:bg-slate-800 py-2 px-3 focus:bg-slate-800"
          >
            <span className="w-12 text-slate-300 font-medium">{lang.display}</span>
            <span className="font-medium text-white">{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
