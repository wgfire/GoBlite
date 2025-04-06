import { atom, useAtom } from "jotai";
import { useEffect, useCallback } from "react";
import { Extension } from "@codemirror/state";
import { darkThemeExtension } from "./themes/darkTheme";
import { lightThemeExtension } from "./themes/lightTheme";
import { editorTheme } from "./themes/base";
import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";

export type EditorTheme = "light" | "dark" | "system" | "base";

// Get the initial theme from localStorage or default to 'dark'
const getInitialTheme = (): EditorTheme => {
  if (typeof window === "undefined") return "dark";

  const savedTheme = localStorage.getItem("editor-theme") as EditorTheme;
  return savedTheme || "dark";
};

// Create the theme atom
export const editorThemeAtom = atom<EditorTheme>(getInitialTheme());

// Create a derived atom for the actual theme extension
export const themeExtensionAtom = atom<Extension>((get) => {
  const theme = get(editorThemeAtom);
  return getThemeExtension(theme);
});

/**
 * Get the appropriate theme extension based on the selected theme
 */
export function getThemeExtension(theme: EditorTheme): Extension {
  switch (theme) {
    case "dark":
      return darkThemeExtension;
    case "light":
      return lightThemeExtension;
    case "system":
      // Use system preference
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return darkThemeExtension;
      } else {
        return lightThemeExtension;
      }
    case "base":
    default:
      return [editorTheme, syntaxHighlighting(defaultHighlightStyle)];
  }
}

/**
 * Custom hook for using the editor theme
 */
export function useEditorTheme() {
  const [theme, setThemeRaw] = useAtom(editorThemeAtom);

  // Wrap setTheme to also save to localStorage
  const setTheme = useCallback(
    (newTheme: EditorTheme) => {
      setThemeRaw(newTheme);
      localStorage.setItem("editor-theme", newTheme);
    },
    [setThemeRaw]
  );

  // Listen for system theme changes when theme is set to 'system'
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      // Force a re-render by setting the theme to system again
      setThemeRaw("system");
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // For older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        // For older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [theme, setThemeRaw]);

  return { theme, setTheme };
}
