import React from "react";
import { motion } from "framer-motion";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";
import { useEditorTheme, EditorTheme } from "./theme/themeManager";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
// No need for cn import as we're using CSS classes
import "./style/themeSwitcher.css";

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useEditorTheme();

  const themes: { value: EditorTheme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "浅色", icon: <FiSun className="w-4 h-4" /> },
    { value: "dark", label: "深色", icon: <FiMoon className="w-4 h-4" /> },
    { value: "system", label: "系统", icon: <FiMonitor className="w-4 h-4" /> },
  ];

  // Find the current theme object
  const currentTheme = themes.find((t) => t.value === theme) || themes[0];

  return (
    <motion.div className="theme-switcher-container" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Select value={theme} onValueChange={(value) => setTheme(value as EditorTheme)}>
        <SelectTrigger className="theme-switcher-trigger" size="sm">
          <SelectValue placeholder="选择主题">
            <div className="theme-switcher-value">
              <span className="theme-switcher-icon">{currentTheme.icon}</span>
              <span className="theme-switcher-label">{currentTheme.label}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="theme-switcher-content">
          {themes.map((item) => (
            <SelectItem key={item.value} value={item.value} className={`theme-switcher-item ${theme === item.value ? "theme-switcher-item-active" : ""}`}>
              <div className="theme-switcher-option">
                <span className="theme-switcher-option-icon">{item.icon}</span>
                <span className="theme-switcher-option-label">{item.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
};
