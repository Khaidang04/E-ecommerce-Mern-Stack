import React, { createContext, useState, useEffect, useCallback } from "react";

export const ThemeContext = createContext();

const lightPresets = [
  {
    name: "Bright White",
    colors: {
      background: "#F9FAFB",
      text: "#111827",
      textSecondary: "#6B7280",
      buttonPrimary: "#3B82F6",
      buttonSecondary: "#6B7280",
    },
  },
  {
    name: "Soft Cream",
    colors: {
      background: "#FDF7E4",
      text: "#4B3F2C",
      textSecondary: "#7A6C53",
      buttonPrimary: "#F59E0B",
      buttonSecondary: "#A8A29E",
    },
  },
  {
    name: "Cool Blue",
    colors: {
      background: "#E0F2FE",
      text: "#1E3A8A",
      textSecondary: "#64748B",
      buttonPrimary: "#2563EB",
      buttonSecondary: "#94A3B8",
    },
  },
  {
    name: "Rose Pink",
    colors: {
      background: "#FFE4E6",
      text: "#4C1D95",
      textSecondary: "#9F7AEA",
      buttonPrimary: "#EC4899",
      buttonSecondary: "#C4B5FD",
    },
  },
  {
    name: "Emerald Green",
    colors: {
      background: "#ECFDF5",
      text: "#064E3B",
      textSecondary: "#6EE7B7",
      buttonPrimary: "#10B981",
      buttonSecondary: "#A7F3D0",
    },
  },
  // New Light Presets
  {
    name: "Lavender Mist",
    colors: {
      background: "#F3E8FF",
      text: "#4C1D95",
      textSecondary: "#8B5CF6",
      buttonPrimary: "#A855F7",
      buttonSecondary: "#D8B4FE",
    },
  },
  {
    name: "Sunset Glow",
    colors: {
      background: "#FFEDD5",
      text: "#7C2D12",
      textSecondary: "#F97316",
      buttonPrimary: "#F97316",
      buttonSecondary: "#FDBA74",
    },
  },
  {
    name: "Mint Breeze",
    colors: {
      background: "#E6FFFA",
      text: "#115E59",
      textSecondary: "#4FD1C5",
      buttonPrimary: "#14B8A6",
      buttonSecondary: "#99F6E4",
    },
  },
  {
    name: "Peach Blossom",
    colors: {
      background: "#FFEBE6",
      text: "#9D174D",
      textSecondary: "#F472B6",
      buttonPrimary: "#F472B6",
      buttonSecondary: "#F9A8D4",
    },
  },
  {
    name: "Sky Serenity",
    colors: {
      background: "#E0F7FA",
      text: "#164E63",
      textSecondary: "#22D3EE",
      buttonPrimary: "#06B6D4",
      buttonSecondary: "#67E8F9",
    },
  },
];

const darkPresets = [
  {
    name: "Deep Night",
    colors: {
      background: "#1F2937",
      text: "#F3F4F6",
      textSecondary: "#9CA3AF",
      buttonPrimary: "#60A5FA",
      buttonSecondary: "#6B7280",
    },
  },
  {
    name: "Midnight Blue",
    colors: {
      background: "#0F172A",
      text: "#E2E8F0",
      textSecondary: "#94A3B8",
      buttonPrimary: "#3B82F6",
      buttonSecondary: "#64748B",
    },
  },
  {
    name: "Twilight Purple",
    colors: {
      background: "#2D1B4E",
      text: "#EDE9FE",
      textSecondary: "#C4B5FD",
      buttonPrimary: "#8B5CF6",
      buttonSecondary: "#A78BFA",
    },
  },
  {
    name: "Ocean Night",
    colors: {
      background: "#112D4E",
      text: "#DBEAFE",
      textSecondary: "#93C5FD",
      buttonPrimary: "#3B82F6",
      buttonSecondary: "#60A5FA",
    },
  },
  {
    name: "Cosmic Gray",
    colors: {
      background: "#2F3640",
      text: "#F4F4F5",
      textSecondary: "#A1A1AA",
      buttonPrimary: "#F472B6",
      buttonSecondary: "#F43F5E",
    },
  },
  // New Dark Presets
  {
    name: "Starry Indigo",
    colors: {
      background: "#1E1B4B",
      text: "#E0E7FF",
      textSecondary: "#A5B4FC",
      buttonPrimary: "#6366F1",
      buttonSecondary: "#818CF8",
    },
  },
  {
    name: "Crimson Dusk",
    colors: {
      background: "#2D1616",
      text: "#FEE2E2",
      textSecondary: "#FCA5A5",
      buttonPrimary: "#EF4444",
      buttonSecondary: "#F87171",
    },
  },
  {
    name: "Forest Shadow",
    colors: {
      background: "#1A2E2A",
      text: "#D1FAE5",
      textSecondary: "#6EE7B7",
      buttonPrimary: "#10B981",
      buttonSecondary: "#34D399",
    },
  },
  {
    name: "Amethyst Night",
    colors: {
      background: "#2C1A4A",
      text: "#E9D5FF",
      textSecondary: "#C084FC",
      buttonPrimary: "#A855F7",
      buttonSecondary: "#D946EF",
    },
  },
  {
    name: "Slate Abyss",
    colors: {
      background: "#1E293B",
      text: "#E2E8F0",
      textSecondary: "#94A3B8",
      buttonPrimary: "#0EA5E9",
      buttonSecondary: "#38BDF8",
    },
  },
];

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("auto");
  const [theme, setTheme] = useState("light");
  const [lightColors, setLightColors] = useState(lightPresets[0].colors);
  const [darkColors, setDarkColors] = useState(darkPresets[0].colors);
  const [isManualMode, setIsManualMode] = useState(false);

  const updateThemeBasedOnTime = useCallback(() => {
    if (isManualMode) return; // Skip time-based updates if manual mode is active
    const currentHour = new Date().getHours();
    let newTheme = "light";
    let preset;

    if (currentHour >= 6 && currentHour < 12) {
      newTheme = "light";
      preset = lightPresets.find((p) => p.name === "Bright White");
    } else if (currentHour >= 12 && currentHour < 18) {
      newTheme = "light";
      preset = lightPresets.find((p) => p.name === "Soft Cream");
    } else {
      newTheme = "dark";
      preset = darkPresets.find((p) => p.name === "Midnight Blue");
    }

    setTheme(newTheme);
    if (newTheme === "light" && preset) {
      setLightColors(preset.colors);
    } else if (newTheme === "dark" && preset) {
      setDarkColors(preset.colors);
    }
  }, [isManualMode]);

  useEffect(() => {
    if (mode === "auto") {
      setIsManualMode(false);
      updateThemeBasedOnTime();
      const interval = setInterval(updateThemeBasedOnTime, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [mode, isManualMode, updateThemeBasedOnTime]);

  const changeMode = (newMode, selectedPreset = null) => {
    setMode(newMode);
    if (newMode !== "auto") {
      setIsManualMode(true);
      setTheme(newMode);
      // Only reset colors if no preset is provided
      if (!selectedPreset) {
        if (newMode === "light") {
          setLightColors(lightPresets[0].colors);
        } else if (newMode === "dark") {
          setDarkColors(darkPresets[0].colors);
        }
      }
    } else {
      setIsManualMode(false);
      updateThemeBasedOnTime();
    }
  };

  const applyPreset = (themeType, presetName) => {
    if (themeType === "light") {
      const preset = lightPresets.find((p) => p.name === presetName);
      if (preset) {
        setLightColors(preset.colors);
        setTheme("light"); // Ensure theme matches the preset type
      }
    } else if (themeType === "dark") {
      const preset = darkPresets.find((p) => p.name === presetName);
      if (preset) {
        setDarkColors(preset.colors);
        setTheme("dark"); // Ensure theme matches the preset type
      }
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        theme,
        changeMode,
        lightColors,
        darkColors,
        lightPresets,
        darkPresets,
        applyPreset,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
