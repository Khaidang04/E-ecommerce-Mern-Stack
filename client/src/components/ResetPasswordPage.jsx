import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext"; // Corrected path
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const ResetPasswordPage = ({ setMessage }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { theme, lightColors, darkColors } = useContext(ThemeContext);
  const [password, setPassword] = useState("");
  const [isValidToken, setIsValidToken] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`/auth/reset-password/${token}`, {
          headers: { "Cache-Control": "no-cache" },
        });
        if (response.status === 200) {
          setIsValidToken(true);
        } else {
          throw new Error("Token verification failed");
        }
      } catch (error) {
        setIsValidToken(false);
        const errorMsg =
          error.response?.data?.msg || "Liên kết không hợp lệ hoặc đã hết hạn";
        setError(errorMsg);
        setMessage(errorMsg);
        setTimeout(() => navigate("/login"), 5000);
      }
    };
    verifyToken();
  }, [token, navigate, setMessage]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/auth/reset-password/${token}`, {
        password,
      });
      setMessage(data.msg || "Đặt lại mật khẩu thành công!");
      navigate("/login", { replace: true });
    } catch (error) {
      setMessage(error.response?.data?.msg || "Đã có lỗi xảy ra");
    }
  };

  const getThemeStyles = () => {
    if (theme === "light") {
      return {
        backgroundColor: `${lightColors.background}CC`,
        color: lightColors.text,
      };
    } else if (theme === "dark") {
      return {
        backgroundColor: `${darkColors.background}CC`,
        color: darkColors.text,
      };
    } else {
      return { backgroundColor: "#FFF7E6CC", color: "#4A4A4A" };
    }
  };

  const getSecondaryThemeStyles = () => {
    if (theme === "light") {
      return {
        background: `linear-gradient(135deg, ${lightColors.buttonPrimary}, ${lightColors.buttonSecondary})`,
        color: "#FFFFFF",
      };
    } else if (theme === "dark") {
      return {
        background: `linear-gradient(135deg, ${darkColors.buttonPrimary}, ${darkColors.buttonSecondary})`,
        color: "#FFFFFF",
      };
    } else {
      return {
        background: "linear-gradient(135deg, #D97706, #A68A64)",
        color: "#FFFFFF",
      };
    }
  };

  const getTextStyles = () => {
    if (theme === "light") {
      return { color: lightColors.textSecondary };
    } else if (theme === "dark") {
      return { color: darkColors.textSecondary };
    } else {
      return { color: "#6B7280" };
    }
  };

  const getInputStyles = () => {
    if (theme === "light") {
      return {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        color: "#000000",
        borderColor: "#D1D5DB",
      };
    } else if (theme === "dark") {
      return {
        backgroundColor: "rgba(55, 65, 81, 0.9)",
        color: "#FFFFFF",
        borderColor: "#4B5563",
      };
    } else {
      return {
        backgroundColor: "rgba(254, 243, 199, 0.9)",
        color: "#4A4A4A",
        borderColor: "#9CA3AF",
      };
    }
  };

  if (isValidToken === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Đang xác thực liên kết...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="text-center p-8 rounded-2xl shadow-2xl max-w-md mx-auto"
          style={getThemeStyles()}
        >
          <h2 className="text-2xl font-bold mb-4">Lỗi</h2>
          <p className="mb-4 text-red-500">{error}</p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition duration-200"
          >
            Quay lại trang đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className="p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto"
        style={getThemeStyles()}
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center">
          Đặt Lại Mật Khẩu
        </h2>
        {error && (
          <p className="mb-4 text-center text-red-500 text-sm font-medium p-2 rounded-lg">
            {error}
          </p>
        )}
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="relative">
            <label
              className="block text-sm font-medium"
              style={getTextStyles()}
            >
              Mật khẩu mới
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={getInputStyles()}
              required
              placeholder="Nhập mật khẩu mới"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 transform -translate-y-1/2"
              style={getTextStyles()}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-lg"
            style={getSecondaryThemeStyles()}
          >
            Đặt Lại Mật Khẩu
          </button>
        </form>
        <button
          onClick={() => navigate("/login", { replace: true })}
          className="w-full mt-4 py-2 rounded-lg font-medium bg-gray-500 text-white hover:bg-gray-600"
        >
          Quay lại Đăng Nhập
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;