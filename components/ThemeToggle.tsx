"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button aria-label="Toggle dark mode" className="btn btn-ghost" onClick={() => setTheme(isDark ? "light" : "dark")}>
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
