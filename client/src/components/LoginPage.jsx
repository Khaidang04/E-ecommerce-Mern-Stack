import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext"; // Corrected path
import ReCAPTCHA from "react-google-recaptcha";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const LoginPage = ({ setUser, message, setMessage }) => {
  const navigate = useNavigate();
  const { theme, lightColors, darkColors } = useContext(ThemeContext);
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: null,
  });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    if (!token) {
      setMessage("CAPTCHA đã hết hạn, vui lòng thử lại");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      if (formData.avatar) {
        formDataToSend.append("avatar", formData.avatar);
      }

      const { data } = await axios.post("/auth/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(data.msg || "Đăng ký thành công!");
      setIsRegister(false);
      setFormData({ username: "", email: "", password: "", avatar: null });
      setCaptchaToken(null);
    } catch (error) {
      setMessage(error.response?.data?.msg || "Đã có lỗi xảy ra");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!captchaToken && !isRegister) {
      setMessage("Vui lòng xác thực CAPTCHA");
      return;
    }
    try {
      const { data } = await axios.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      setUser(data.data);
      if (rememberMe) {
        localStorage.setItem("savedEmail", formData.email);
        localStorage.setItem("savedPassword", formData.password);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
        localStorage.removeItem("rememberMe");
      }
      setMessage("Đăng nhập thành công!");
      navigate("/home", { replace: true });
    } catch (error) {
      setMessage(error.response?.data?.msg || "Đã có lỗi xảy ra");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    console.log("Captcha token:", captchaToken); // Kiểm tra token
    if (!captchaToken) {
      setMessage("Vui lòng xác thực CAPTCHA");
      return;
    }
    try {
      const { data } = await axios.post("/auth/forgot-password", {
        email: formData.email,
        captchaToken, // Thêm token vào yêu cầu
      });
      setMessage(data.msg || "Liên kết đặt lại mật khẩu đã được gửi!");
      setIsForgotPassword(false);
      setCaptchaToken(null);
      setFormData({ ...formData, email: "", password: "" });
    } catch (error) {
      setMessage(error.response?.data?.msg || "Đã có lỗi xảy ra");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/api/v1/auth/google";
  };

  const getThemeStyles = () => {
    if (theme === "light") {
      return {
        backgroundColor: `${lightColors.background}CC`,
        color: lightColors.text,
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      };
    } else if (theme === "dark") {
      return {
        backgroundColor: `${darkColors.background}CC`,
        color: darkColors.text,
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      };
    } else {
      return {
        backgroundColor: "#FFF7E6CC",
        color: "#4A4A4A",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      };
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

  const getMessageStyles = () => {
    if (theme === "light") {
      return { color: "#10B981", backgroundColor: "#D1FAE5" };
    } else if (theme === "dark") {
      return { color: "#34D399", backgroundColor: "#1A2E2A" };
    } else {
      return { color: "#059669", backgroundColor: "#D1FAE5" };
    }
  };

  const getInputStyles = () => {
    if (theme === "light") {
      return {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        color: "#000000",
        borderColor: "#D1D5DB",
        transition: "all 0.3s ease",
      };
    } else if (theme === "dark") {
      return {
        backgroundColor: "rgba(55, 65, 81, 0.9)",
        color: "#FFFFFF",
        borderColor: "#4B5563",
        transition: "all 0.3s ease",
      };
    } else {
      return {
        backgroundColor: "rgba(254, 243, 199, 0.9)",
        color: "#4A4A4A",
        borderColor: "#9CA3AF",
        transition: "all 0.3s ease",
      };
    }
  };

  return (
    <div
      className="p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-500 ease-in-out animate-fade-in"
      style={getThemeStyles()}
    >
      <h2 className="text-3xl font-extrabold mb-6 text-center tracking-tight">
        {isRegister
          ? "Đăng Ký Tài Khoản"
          : isForgotPassword
          ? "Khôi Phục Mật Khẩu"
          : "Đăng Nhập Ngay"}{" "}
        <span className="text-blue-500">EcommerceMern</span>
      </h2>
      <form
        onSubmit={
          isRegister
            ? handleRegister
            : isForgotPassword
            ? handleForgotPassword
            : handleLogin
        }
        encType={
          isRegister
            ? "multipart/form-data"
            : "application/x-www-form-urlencoded"
        }
        autoComplete="on"
        id="login-form"
        className="space-y-6"
      >
        {isRegister && (
          <>
            <div>
              <label
                className="block text-sm font-medium"
                style={getTextStyles()}
              >
                Tên người dùng
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 ease-in-out hover:shadow-md"
                style={getInputStyles()}
                required
                autoComplete="username"
                placeholder="Nhập tên người dùng"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium"
                style={getTextStyles()}
              >
                Ảnh đại diện
              </label>
              <input
                type="file"
                name="avatar"
                onChange={handleChange}
                accept="image/*"
                className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 ease-in-out hover:shadow-md"
                style={getInputStyles()}
              />
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium" style={getTextStyles()}>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 ease-in-out hover:shadow-md"
            style={getInputStyles()}
            required
            autoComplete="email"
            id="email"
            placeholder="Nhập email của bạn"
          />
        </div>
        {!isForgotPassword && (
          <div className="relative">
            <label
              className="block text-sm font-medium"
              style={getTextStyles()}
            >
              Mật khẩu
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 ease-in-out hover:shadow-md"
              style={getInputStyles()}
              required
              autoComplete="current-password"
              id="password"
              placeholder="Nhập mật khẩu"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 transform -translate-y-1/2"
              style={getTextStyles()}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 transition-transform duration-200 hover:scale-110" />
              ) : (
                <EyeIcon className="h-5 w-5 transition-transform duration-200 hover:scale-110" />
              )}
            </button>
          </div>
        )}
        {!isRegister && !isForgotPassword && (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2 rounded text-blue-500 focus:ring-blue-400"
            />
            <label className="text-sm" style={getTextStyles()}>
              Ghi nhớ tôi
            </label>
          </div>
        )}
        {(!isRegister && !isForgotPassword) || isForgotPassword ? (
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
              theme={theme}
              size="normal"
              hl="vi"
              className="transform transition-all duration-300 hover:scale-105"
            />
          </div>
        ) : null}
        <button
          type="submit"
          className="w-full py-3 rounded-lg font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          style={getSecondaryThemeStyles()}
        >
          {isRegister
            ? "Đăng Ký"
            : isForgotPassword
            ? "Gửi Liên Kết Đặt Lại"
            : "Đăng Nhập"}
        </button>
      </form>
      <div className="mt-6 flex justify-between gap-4">
        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setIsForgotPassword(false);
            setMessage("");
            setCaptchaToken(null);
          }}
          className="w-1/2 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out bg-gray-500 text-white hover:bg-gray-600 hover:shadow-md transform hover:scale-105"
        >
          {isRegister ? "Đăng Nhập" : "Đăng Ký"}
        </button>
        {!isRegister && (
          <button
            onClick={() => {
              setIsForgotPassword(true);
              setMessage("");
              setCaptchaToken(null);
            }}
            className="w-1/2 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out bg-gray-500 text-white hover:bg-gray-600 hover:shadow-md transform hover:scale-105"
          >
            Quên Mật Khẩu
          </button>
        )}
      </div>
      <button
        onClick={handleGoogleLogin}
        className="w-full mt-4 py-3 rounded-lg font-semibold text-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-lg transform hover:scale-105"
      >
        Đăng Nhập với Google
      </button>
      {message && (
        <p
          className="mt-4 text-center text-sm font-medium p-2 rounded-lg animate-pulse"
          style={getMessageStyles()}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default LoginPage;
