import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";

const HomePage = ({ user, setUser, message, setMessage }) => {
  const navigate = useNavigate();
  const { theme, lightColors, darkColors } = useContext(ThemeContext);
  const [showWelcome, setShowWelcome] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Thêm trạng thái

  const handleUserActivity = () => {
    setLastActivity(Date.now());
  };

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true); // Đặt trạng thái đăng xuất
    try {
      await axios.post("/auth/logout");
      setUser(null);
      document.cookie =
        "userInfo=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      setMessage("Đã đăng xuất thành công");
      navigate("/login", { replace: true });
    } catch (error) {
      setMessage("Đã có lỗi khi đăng xuất");
      setIsLoggingOut(false); // Reset trạng thái nếu có lỗi
    }
  }, [setUser, setMessage, navigate]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) =>
      window.addEventListener(event, handleUserActivity)
    );

    const timer = setInterval(() => {
      if (Date.now() - lastActivity > 30000) {
        handleLogout();
      }
    }, 1000);

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleUserActivity)
      );
      clearInterval(timer);
    };
  }, [lastActivity, handleLogout]);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const getThemeStyles = () => {
    if (theme === "light") {
      return {
        backgroundColor: lightColors.background,
        color: lightColors.text,
      };
    } else if (theme === "dark") {
      return { backgroundColor: darkColors.background, color: darkColors.text };
    } else {
      return { backgroundColor: "#fff7e6", color: "#4a4a4a" };
    }
  };

  const getSecondaryThemeStyles = () => {
    if (theme === "light") {
      return { backgroundColor: lightColors.buttonPrimary, color: "#ffffff" };
    } else if (theme === "dark") {
      return { backgroundColor: darkColors.buttonPrimary, color: "#ffffff" };
    } else {
      return { backgroundColor: "#d97706", color: "#ffffff" };
    }
  };

  const getTextStyles = () => {
    if (theme === "light") {
      return { color: lightColors.textSecondary };
    } else if (theme === "dark") {
      return { color: darkColors.textSecondary };
    } else {
      return { color: "#6b7280" };
    }
  };

  const getMessageStyles = () => {
    if (theme === "light") {
      return { color: "#10b981" };
    } else if (theme === "dark") {
      return { color: "#34d399" };
    } else {
      return { color: "#059669" };
    }
  };

  // Nếu đang đăng xuất, không render gì cả
  if (isLoggingOut) {
    return null;
  }

  if (!user) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={getThemeStyles()}
      >
        <div className="text-center">
          <p className="mb-4" style={getTextStyles()}>
            Bạn cần đăng nhập để truy cập trang này.
          </p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="px-4 py-2 rounded-lg transition duration-200"
            style={getSecondaryThemeStyles()}
          >
            Đi đến trang đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="text-center p-8 rounded-lg shadow-lg w-full max-w-md mx-auto relative"
      style={getThemeStyles()}
    >
      {showWelcome && (
        <div className="absolute top-0 left-0 right-0 mx-auto w-fit px-4 py-2 rounded-b-lg shadow-md transform -translate-y-12 animate-slide-down bg-green-500 text-white">
          Chào mừng bạn, {user.username}!
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">Xin chào, {user.username}!</h2>
      {user.avatar ? (
        <img
          src={user.avatar}
          alt="Avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
      ) : (
        <p className="mb-4" style={getTextStyles()}>
          Không có ảnh đại diện
        </p>
      )}
      <p className="mb-2" style={getTextStyles()}>
        Email: {user.email}
      </p>
      <p className="mb-4" style={getTextStyles()}>
        Quyền quản trị: {user.isAdmin ? "Có" : "Không"}
      </p>
      <p className="mb-4" style={getTextStyles()}>
        Ngày tạo tài khoản: {new Date(user.createdAt).toLocaleString()}
      </p>
      <p className="mb-4" style={getTextStyles()}>
        Xác thực: {user.isVerified ? "Đã xác thực" : "Chưa xác thực"}
      </p>
      <button
        onClick={handleLogout}
        className="w-full py-2 rounded-lg transition duration-200 bg-red-500 hover:bg-red-600 text-white"
      >
        Đăng xuất
      </button>
      {message && (
        <p className="mt-4 text-center" style={getMessageStyles()}>
          {message}
        </p>
      )}
    </div>
  );
};

export default HomePage;
