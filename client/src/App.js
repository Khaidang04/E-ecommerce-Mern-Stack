import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import LoginPage from "./components/LoginPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import HomePage from "./components/HomePage";
import ErrorBoundary from "./components/ErrorBoundary";
import ColorPicker from "./components/ColorPicker";
import Ballpit from "./components/Ballpit";
import { ThemeContext, ThemeProvider } from "./context/ThemeContext";
import {
  SunIcon,
  MoonIcon,
  ClockIcon,
  LanguageIcon,
} from "@heroicons/react/24/outline";

// Configure Axios defaults
axios.defaults.baseURL = "http://localhost:4000/api/v1";
axios.defaults.withCredentials = true;
axios.defaults.timeout = 300000;

// Supported languages to validate against
const supportedLanguages = ["vi", "en", "es", "fr", "de", "ja"];

const AppContent = ({
  user,
  setUser,
  message,
  setMessage,
  loading,
  setLoading,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, changeMode, applyPreset, lightColors, darkColors } =
    useContext(ThemeContext);
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(null);
  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem("language");
    return supportedLanguages.includes(savedLang) ? savedLang : "vi";
  });

  // Refs for the dropdowns to detect outside clicks
  const modeMenuRef = useRef(null);
  const languageMenuRef = useRef(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modeMenuRef.current && !modeMenuRef.current.contains(event.target)) {
        setShowModeMenu(false);
      }
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target)
      ) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Persist language selection to localStorage
  useEffect(() => {
    if (supportedLanguages.includes(language)) {
      localStorage.setItem("language", language);
    } else {
      setLanguage("vi");
      localStorage.setItem("language", "vi");
    }
  }, [language]);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get("/users/profile");
      setUser(data.data);
      setMessage("Đăng nhập thành công!");
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const { status } = await axios.post("/auth/refresh-token");
          if (status === 200) {
            const { data } = await axios.get("/users/profile");
            setUser(data.data);
            setMessage("Đăng nhập thành công sau khi gia hạn token!");
          } else {
            throw new Error("Không thể gia hạn token");
          }
        } catch (refreshError) {
          setUser(null);
          document.cookie =
            "userInfo=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
          setMessage("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        }
      } else {
        setUser(null);
        document.cookie =
          "userInfo=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        setMessage(
          error.response?.data?.msg || "Lỗi khi lấy thông tin người dùng"
        );
      }
    } finally {
      setLoading(false);
    }
  }, [setUser, setMessage, setLoading]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");

    const isAuthPage =
      location.pathname === "/login" ||
      location.pathname.startsWith("/reset-password/");
    if (isAuthPage) {
      setLoading(false);
      return;
    }

    if (error === "auth_failed") {
      setMessage("Đăng nhập Google thất bại, vui lòng thử lại");
      setLoading(false);
      navigate("/login", { replace: true });
    } else {
      fetchUser();
    }
  }, [fetchUser, navigate, setMessage, setLoading, location.pathname]);

  const getThemeClasses = () => {
    if (theme === "light") return "text-gray-900";
    if (theme === "dark") return "text-gray-100";
    return "bg-afternoon text-afternoon-text";
  };

  const getBackgroundClasses = () => {
    if (theme === "light") {
      return lightColors.background === "#F9FAFB"
        ? "bg-bright-white"
        : lightColors.background === "#FDF7E4"
        ? "bg-soft-cream"
        : lightColors.background === "#E0F2FE"
        ? "bg-cool-blue"
        : lightColors.background === "#FFE4E6"
        ? "bg-rose-pink"
        : lightColors.background === "#ECFDF5"
        ? "bg-emerald-green"
        : lightColors.background === "#F3E8FF"
        ? "bg-lavender-mist"
        : lightColors.background === "#FFEDD5"
        ? "bg-sunset-glow"
        : lightColors.background === "#E6FFFA"
        ? "bg-mint-breeze"
        : lightColors.background === "#FFEBE6"
        ? "bg-peach-blossom"
        : lightColors.background === "#E0F7FA"
        ? "bg-sky-serenity"
        : "bg-bright-white";
    }
    if (theme === "dark") {
      return darkColors.background === "#1F2937"
        ? "bg-deep-night"
        : darkColors.background === "#0F172A"
        ? "bg-midnight-blue"
        : darkColors.background === "#2D1B4E"
        ? "bg-twilight-purple"
        : darkColors.background === "#112D4E"
        ? "bg-ocean-night"
        : darkColors.background === "#2F3640"
        ? "bg-cosmic-gray"
        : darkColors.background === "#1E1B4B"
        ? "bg-starry-indigo"
        : darkColors.background === "#2D1616"
        ? "bg-crimson-dusk"
        : darkColors.background === "#1A2E2A"
        ? "bg-forest-shadow"
        : darkColors.background === "#2C1A4A"
        ? "bg-amethyst-night"
        : darkColors.background === "#1E293B"
        ? "bg-slate-abyss"
        : "bg-deep-night";
    }
    return "bg-afternoon";
  };

  const getSecondaryThemeClasses = () => {
    if (theme === "light") return "bg-blue-500 hover:bg-blue-600 text-white";
    if (theme === "dark") return "bg-blue-600 hover:bg-blue-700 text-white";
    return "bg-yellow-600 hover:bg-yellow-700 text-white";
  };

  const getThemeToggleClasses = () => {
    if (theme === "light")
      return "bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500 shadow-lg";
    if (theme === "dark")
      return "bg-gradient-to-r from-gray-700 to-gray-500 text-white hover:from-gray-600 hover:to-gray-400 backdrop-blur-md bg-opacity-80 shadow-lg";
    return "bg-gradient-to-r from-yellow-700 to-yellow-500 text-white hover:from-yellow-800 hover:to-yellow-600 backdrop-blur-md bg-opacity-80 shadow-lg";
  };

  const getTextStyles = () => {
    if (theme === "light") return { color: lightColors.textSecondary };
    if (theme === "dark") return { color: darkColors.textSecondary };
    return { color: "#6B7280" };
  };

  const handleModeSelect = (newMode) => {
    if (newMode === "light" || newMode === "dark") {
      setShowColorPicker(newMode);
    } else {
      changeMode(newMode);
    }
    setShowModeMenu(false);
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${getBackgroundClasses()} ${getThemeClasses()}`}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Đang tải...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (
    message &&
    message.includes("hết hạn") &&
    !location.pathname.startsWith("/login") &&
    !location.pathname.startsWith("/reset-password/")
  ) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${getBackgroundClasses()} ${getThemeClasses()}`}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Đã xảy ra lỗi</h2>
          <p className="mb-4">{message}</p>
          <button
            onClick={() => {
              setMessage("");
              fetchUser();
            }}
            className={`px-4 py-2 rounded-lg mr-2 ${getSecondaryThemeClasses()} transition duration-200`}
          >
            Thử lại
          </button>
          <button
            onClick={() => {
              setMessage("");
              navigate("/login", { replace: true });
            }}
            className={`px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition duration-200`}
          >
            Quay lại trang đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {showColorPicker && (
        <ColorPicker
          themeType={showColorPicker}
          onColorChange={(preset) => {
            applyPreset(showColorPicker, preset.name);
            changeMode(showColorPicker, preset.name);
          }}
          onClose={() => setShowColorPicker(null)}
        />
      )}

      <div className="relative min-h-screen">
        <ErrorBoundary>
          <Routes>
            <Route
              path="/login"
              element={
                <div className="relative w-full min-h-screen flex flex-col items-center justify-center transition-all duration-500 ease-in-out">
                  <div
                    className={`absolute top-0 left-0 w-full h-full z-1 transition-all duration-500 ease-in-out ${getBackgroundClasses()}`}
                  ></div>
                  <div className="absolute top-0 left-0 w-full h-full z-0">
                    <Ballpit
                      count={200}
                      gravity={0.05}
                      friction={0.995}
                      wallBounce={0.98}
                      followCursor={true}
                      minSize={0.2}
                      maxSize={0.8}
                      emissive0={0xffffff}
                      darkMode={theme === "dark"}
                      colors={
                        theme === "light"
                          ? lightColors.background === "#F9FAFB"
                            ? [
                                "#FF6B6B",
                                "#4ECDC4",
                                "#45B7D1",
                                "#96CEB4",
                                "#FFE66D",
                              ]
                            : lightColors.background === "#FDF7E4"
                            ? [
                                "#FF9F43",
                                "#EE6352",
                                "#59A5D8",
                                "#84D2F6",
                                "#91E4E0",
                              ]
                            : lightColors.background === "#E0F2FE"
                            ? [
                                "#48BB78",
                                "#ECC94B",
                                "#F56565",
                                "#9F7AEA",
                                "#4299E1",
                              ]
                            : lightColors.background === "#FFE4E6"
                            ? [
                                "#ED64A6",
                                "#F687B3",
                                "#B794F4",
                                "#FBD38D",
                                "#68D391",
                              ]
                            : lightColors.background === "#ECFDF5"
                            ? [
                                "#38A169",
                                "#319795",
                                "#D69E2E",
                                "#E53E3E",
                                "#805AD5",
                              ]
                            : lightColors.background === "#F3E8FF"
                            ? [
                                "#A855F7",
                                "#D8B4FE",
                                "#8B5CF6",
                                "#E9D5FF",
                                "#C084FC",
                              ]
                            : lightColors.background === "#FFEDD5"
                            ? [
                                "#F97316",
                                "#FDBA74",
                                "#EA580C",
                                "#FFEDD5",
                                "#DC2626",
                              ]
                            : lightColors.background === "#E6FFFA"
                            ? [
                                "#14B8A6",
                                "#99F6E4",
                                "#0D9488",
                                "#5EEAD4",
                                "#2DD4BF",
                              ]
                            : lightColors.background === "#FFEBE6"
                            ? [
                                "#F472B6",
                                "#F9A8D4",
                                "#EC4899",
                                "#FDA4AF",
                                "#DB2777",
                              ]
                            : lightColors.background === "#E0F7FA"
                            ? [
                                "#06B6D4",
                                "#67E8F9",
                                "#0E7490",
                                "#22D3EE",
                                "#155E75",
                              ]
                            : [
                                "#FF6B6B",
                                "#4ECDC4",
                                "#45B7D1",
                                "#96CEB4",
                                "#FFE66D",
                              ]
                          : darkColors.background === "#1F2937"
                          ? [
                              "#A78BFA",
                              "#F472B6",
                              "#4ADE80",
                              "#60A5FA",
                              "#FBBF24",
                            ]
                          : darkColors.background === "#0F172A"
                          ? [
                              "#6366F1",
                              "#EC4899",
                              "#10B981",
                              "#F59E0B",
                              "#7C3AED",
                            ]
                          : darkColors.background === "#2D1B4E"
                          ? [
                              "#8B5CF6",
                              "#EC4899",
                              "#34D399",
                              "#FBBF24",
                              "#60A5FA",
                            ]
                          : darkColors.background === "#112D4E"
                          ? [
                              "#3B82F6",
                              "#F472B6",
                              "#4ADE80",
                              "#F59E0B",
                              "#A78BFA",
                            ]
                          : darkColors.background === "#2F3640"
                          ? [
                              "#0EA5E9",
                              "#F472B6",
                              "#38BDF8",
                              "#FBBF24",
                              "#60A5FA",
                            ]
                          : darkColors.background === "#1E1B4B"
                          ? [
                              "#6366F1",
                              "#A5B4FC",
                              "#4F46E5",
                              "#E0E7FF",
                              "#818CF8",
                            ]
                          : darkColors.background === "#2D1616"
                          ? [
                              "#EF4444",
                              "#FCA5A5",
                              "#DC2626",
                              "#FEE2E2",
                              "#F87171",
                            ]
                          : darkColors.background === "#1A2E2A"
                          ? [
                              "#10B981",
                              "#6EE7B7",
                              "#059669",
                              "#D1FAE5",
                              "#34D399",
                            ]
                          : darkColors.background === "#2C1A4A"
                          ? [
                              "#A855F7",
                              "#D946EF",
                              "#9333EA",
                              "#E9D5FF",
                              "#C084FC",
                            ]
                          : darkColors.background === "#1E293B"
                          ? [
                              "#0EA5E9",
                              "#38BDF8",
                              "#0284C7",
                              "#E0F7FA",
                              "#7DD3FC",
                            ]
                          : [
                              "#A78BFA",
                              "#F472B6",
                              "#4ADE80",
                              "#60A5FA",
                              "#FBBF24",
                            ]
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                        opacity: theme === "dark" ? 0.6 : 0.8,
                      }}
                    />
                    {/* Theme and Language Toggle Buttons */}
                    <div className="fixed top-4 right-4 z-20 flex gap-2">
                      {/* Language Toggle */}
                      <div ref={languageMenuRef} className="relative">
                        <button
                          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                          className={`flex items-center px-3 py-1 rounded-lg font-semibold text-sm animate-pulse ${getThemeToggleClasses()} transition duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/50`}
                        >
                          <span className="mr-2">
                            {language === "vi"
                              ? "Tiếng Việt"
                              : language === "en"
                              ? "English"
                              : language === "es"
                              ? "Español"
                              : language === "fr"
                              ? "Français"
                              : language === "de"
                              ? "Deutsch"
                              : "日本語"}
                          </span>
                          <LanguageIcon className="h-4 w-4" />
                        </button>
                        {showLanguageMenu && (
                          <div
                            className="absolute top-10 right-0 shadow-xl rounded-lg z-20 transform transition-all duration-300 ease-in-out scale-100 backdrop-blur-lg bg-opacity-90 border border-white/30"
                            style={{
                              backgroundColor:
                                theme === "light"
                                  ? "rgba(255, 255, 255, 0.95)"
                                  : "rgba(55, 65, 81, 0.95)",
                            }}
                          >
                            <button
                              onClick={() => handleLanguageSelect("vi")}
                              className="flex items-center w-full text-left px-3 py-1 hover:bg-opacity-20 hover:bg-gray-300 transition duration-200 text-sm font-medium"
                              style={{ color: getTextStyles().color }}
                            >
                              <span>Tiếng Việt</span>
                            </button>
                            <button
                              onClick={() => handleLanguageSelect("en")}
                              className="flex items-center w-full text-left px-3 py-1 hover:bg-opacity-20 hover:bg-gray-300 transition duration-200 text-sm font-medium"
                              style={{ color: getTextStyles().color }}
                            >
                              <span>English</span>
                            </button>
                            <button
                              onClick={() => handleLanguageSelect("es")}
                              className="flex items-center w-full text-left px-3 py-1 hover:bg-opacity-20 hover:bg-gray-300 transition duration-200 text-sm font-medium"
                              style={{ color: getTextStyles().color }}
                            >
                              <span>Español</span>
                            </button>
                            <button
                              onClick={() => handleLanguageSelect("fr")}
                              className="flex items-center w-full text-left px-3 py-1 hover:bg-opacity-20 hover:bg-gray-300 transition duration-200 text-sm font-medium"
                              style={{ color: getTextStyles().color }}
                            >
                              <span>Français</span>
                            </button>
                            <button
                              onClick={() => handleLanguageSelect("de")}
                              className="flex items-center w-full text-left px-3 py-1 hover:bg-opacity-20 hover:bg-gray-300 transition duration-200 text-sm font-medium"
                              style={{ color: getTextStyles().color }}
                            >
                              <span>Deutsch</span>
                            </button>
                            <button
                              onClick={() => handleLanguageSelect("ja")}
                              className="flex items-center w-full text-left px-3 py-1 hover:bg-opacity-20 hover:bg-gray-300 transition duration-200 text-sm font-medium"
                              style={{ color: getTextStyles().color }}
                            >
                              <span>日本語</span>
                            </button>
                          </div>
                        )}
                      </div>
                      {/* Theme Toggle */}
                      <div ref={modeMenuRef} className="relative">
                        <button
                          onClick={() => setShowModeMenu(!showModeMenu)}
                          className={`flex items-center px-3 py-1 rounded-lg font-semibold text-sm animate-pulse ${getThemeToggleClasses()} transition duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/50`}
                        >
                          <span className="mr-2">Chọn chế độ giao diện</span>
                          {theme === "light" ? (
                            <SunIcon className="h-4 w-4" />
                          ) : theme === "dark" ? (
                            <MoonIcon className="h-4 w-4" />
                          ) : (
                            <ClockIcon className="h-4 w-4" />
                          )}
                        </button>
                        {showModeMenu && (
                          <div
                            className="absolute top-10 right-0 shadow-xl rounded-lg z-20 transform transition-all duration-300 ease-in-out scale-100 backdrop-blur-lg bg-opacity-90 border border-white/30"
                            style={{
                              backgroundColor:
                                theme === "light"
                                  ? "rgba(255, 255, 255, 0.95)"
                                  : "rgba(55, 65, 81, 0.95)",
                            }}
                          >
                            <button
                              onClick={() => handleModeSelect("light")}
                              className="flex items-center w-full text-left px-3 py-1 hover:bg-opacity-20 hover:bg-gray-300 transition duration-200 text-sm font-medium"
                              style={{ color: getTextStyles().color }}
                            >
                              <SunIcon className="h-4 w-4 mr-2 text-yellow-500" />
                              Sáng
                            </button>
                            <button
                              onClick={() => handleModeSelect("dark")}
                              className="flex items-center w-full text-left px-3 py-1 hover:bg-opacity-20 hover:bg-gray-300 transition duration-200 text-sm font-medium"
                              style={{ color: getTextStyles().color }}
                            >
                              <MoonIcon className="h-4 w-4 mr-2 text-blue-500" />
                              Tối
                            </button>
                            <button
                              onClick={() => handleModeSelect("auto")}
                              className="flex items-center w-full text-left px-3 py-1 hover:bg-opacity-20 hover:bg-gray-300 transition duration-200 text-sm font-medium"
                              style={{ color: getTextStyles().color }}
                            >
                              <ClockIcon className="h-4 w-4 mr-2 text-green-500" />
                              Tự động
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <LoginPage
                      setUser={setUser}
                      message={message}
                      setMessage={setMessage}
                      language={language}
                      setLanguage={setLanguage}
                    />
                  </div>
                </div>
              }
            />
            <Route
              path="/home"
              element={
                user ? (
                  <HomePage
                    user={user}
                    setUser={setUser}
                    message={message}
                    setMessage={setMessage}
                  />
                ) : (
                  <div
                    className={`flex items-center justify-center min-h-screen ${getBackgroundClasses()} ${getThemeClasses()}`}
                  >
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-4">
                        Bạn cần đăng nhập
                      </h2>
                      <button
                        onClick={() => navigate("/login", { replace: true })}
                        className={`px-4 py-2 rounded-lg ${getSecondaryThemeClasses()} transition duration-200`}
                      >
                        Đăng nhập
                      </button>
                    </div>
                  </div>
                )
              }
            />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage setMessage={setMessage} />}
            />
            <Route
              path="*"
              element={
                <div
                  className={`flex items-center justify-center min-h-screen ${getBackgroundClasses()} ${getThemeClasses()}`}
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">
                      Trang không tồn tại
                    </h2>
                    <button
                      onClick={() => navigate("/login", { replace: true })}
                      className={`px-4 py-2 rounded-lg ${getSecondaryThemeClasses()} transition duration-200`}
                    >
                      Quay lại trang đăng nhập
                    </button>
                  </div>
                </div>
              }
            />
          </Routes>
        </ErrorBoundary>
      </div>
    </div>
  );
};

const App = () => {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <ThemeProvider>
      <AppContent
        user={user}
        setUser={setUser}
        message={message}
        setMessage={setMessage}
        loading={loading}
        setLoading={setLoading}
      />
    </ThemeProvider>
  );
};

export default App;
