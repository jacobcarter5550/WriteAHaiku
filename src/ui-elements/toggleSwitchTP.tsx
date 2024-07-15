import React from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useTheme } from "next-themes";

const ToggleSwitch: React.FC<{ width: number | string }> = ({ width }) => {

  const { theme, setTheme } = useTheme();
  const newTheme = theme === "dark" ? "light" : "dark";
  const isDark = newTheme === "dark";

  const handleToggle = () => {
    setTheme(newTheme);
  };

  return (
    <DarkModeSwitch
      size={width}
      checked={!isDark}
      onChange={handleToggle}
    />
  );
};

export default ToggleSwitch;
