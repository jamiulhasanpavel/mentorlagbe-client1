"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const themeStorageKey = "mentorlagbe:theme";

export function ThemeToggle() {
  useEffect(() => {
    const savedTheme = window.localStorage.getItem(themeStorageKey);
    const shouldUseDark =
      savedTheme === "dark" ||
      (savedTheme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  function toggleTheme() {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextIsDark);
    window.localStorage.setItem(themeStorageKey, nextIsDark ? "dark" : "light");
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="color-animated-border size-10 rounded-full"
    >
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
    </Button>
  );
}
