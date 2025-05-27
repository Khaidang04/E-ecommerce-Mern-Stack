import React, { useState, useCallback, useEffect } from "react";
import {
  Routes,
  Route,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import axios from "axios";

// Configure Axios defaults
axios.defaults.baseURL = "http://localhost:4000/api/v1";
axios.defaults.withCredentials = true;

const isStrongPassword = (password) => {
  const regex = /^[a-zA-Z0-9@#$!%*?&]{6,}$/;
  return regex.test(password);
};

const LoginPage = ({ setUser, message, setMessage }) => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: localStorage.getItem("savedEmail") || "",
    password: localStorage.getItem("savedPassword") || "",
    avatar: null,
  });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberMe") === "true"
  );

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
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isStrongPassword(formData.password)) {
      setMessage("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
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
      setMessage(data.msg);
      setIsRegister(false);
      setFormData({ username: "", email: "", password: "", avatar: null });
      setCaptchaToken(null);
    } catch (error) {
      setMessage(error.response?.data?.msg || "Có lỗi xảy ra");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      setMessage("Vui lòng xác thực CAPTCHA");
      return;
    }
    try {
      const { data } = await axios.post("/auth/login", {
        email: formData.email,
        password: formData.password,
        captchaToken,
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
      navigate("/home");
    } catch (error) {
      setMessage(error.response?.data?.msg || "Có lỗi đăng nhập");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      setMessage("Vui lòng xác thực CAPTCHA");
      return;
    }
    try {
      const { data } = await axios.post("/auth/forgot-password", {
        email: formData.email,
        captchaToken,
      });
      setMessage(data.msg);
      setIsForgotPassword(false);
      setCaptchaToken(null);
    } catch (error) {
      setMessage(error.response?.data?.msg || "Có lỗi xảy ra");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/api/v1/auth/google";
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isRegister
          ? "Đăng ký"
          : isForgotPassword
          ? "Quên mật khẩu"
          : "Đăng nhập"}{" "}
        - EcommerceMern
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
      >
        {isRegister && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Tên người dùng</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                required
                autoComplete="username"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Ảnh đại diện</label>
              <input
                type="file"
                name="avatar"
                onChange={handleChange}
                accept="image/*"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
          </>
        )}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            required
            autoComplete="email"
            id="email"
          />
        </div>
        {!isForgotPassword && (
          <div className="mb-6 relative">
            <label className="block text-gray-700">Mật khẩu</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              required
              autoComplete="current-password"
              id="password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-600"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        )}
        {!isRegister && !isForgotPassword && (
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              Ghi nhớ tôi
            </label>
          </div>
        )}
        {(!isRegister && !isForgotPassword) || isForgotPassword ? (
          <div className="mb-6">
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
            />
          </div>
        ) : null}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          {isRegister
            ? "Đăng ký"
            : isForgotPassword
            ? "Gửi liên kết đặt lại"
            : "Đăng nhập"}
        </button>
      </form>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setIsForgotPassword(false);
            setMessage("");
            setCaptchaToken(null);
          }}
          className="w-1/2 mr-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-200"
        >
          {isRegister ? "Chuyển sang Đăng nhập" : "Chuyển sang Đăng ký"}
        </button>
        {!isRegister && (
          <button
            onClick={() => {
              setIsForgotPassword(true);
              setMessage("");
              setCaptchaToken(null);
            }}
            className="w-1/2 ml-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Quên mật khẩu
          </button>
        )}
      </div>
      <button
        onClick={handleGoogleLogin}
        className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200"
      >
        Đăng nhập với Google
      </button>
      {message && <p className="mt-4 text-center text-green-500">{message}</p>}
    </div>
  );
};

const ResetPasswordPage = ({ setMessage }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState(null);
  const [error, setError] = useState(null);
  const [message, setLocalMessage] = useState("");

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
        setLocalMessage(errorMsg);
        setMessage(errorMsg);
        setTimeout(() => navigate("/login"), 5000);
      }
    };
    verifyToken();
  }, [token, navigate, setMessage]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!isStrongPassword(password)) {
      const errorMsg = "Mật khẩu phải có ít nhất 6 ký tự.";
      setLocalMessage(errorMsg);
      setMessage(errorMsg);
      return;
    }
    try {
      const { data } = await axios.post(`/auth/reset-password/${token}`, {
        password,
      });
      setLocalMessage(data.msg);
      setMessage(data.msg);
      navigate("/login");
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Có lỗi xảy ra";
      setLocalMessage(errorMsg);
      setMessage(errorMsg);
    }
  };

  if (isValidToken === null) {
    return <div className="text-center">Đang kiểm tra liên kết...</div>;
  }

  if (!isValidToken) {
    return (
      <div className="text-center text-red-500 p-8">
        <p>{error}</p>
        <p>Bạn sẽ được chuyển hướng về trang đăng nhập sau 5 giây...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Đặt lại Mật khẩu - EcommerceMern
      </h2>
      <form onSubmit={handleResetPassword}>
        <div className="mb-6 relative">
          <label className="block text-gray-700">Mật khẩu mới</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-600"
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
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Đặt lại Mật khẩu
        </button>
      </form>
      {message && <p className="mt-4 text-center text-green-500">{message}</p>}
    </div>
  );
};

const HomePage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleLogout = useCallback(async () => {
    try {
      await axios.post("/auth/logout");
      setUser(null);
      localStorage.removeItem("savedEmail");
      localStorage.removeItem("savedPassword");
      localStorage.removeItem("rememberMe");
      document.cookie =
        "userInfo=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      setMessage("Đăng xuất thành công");
      navigate("/login");
    } catch (error) {
      setMessage("Có lỗi khi đăng xuất");
      navigate("/login");
    }
  }, [navigate, setUser]);

  // Auto-logout after 30 seconds of inactivity
  useEffect(() => {
    let timeoutId;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleLogout();
      }, 30000); // 30 seconds
    };

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimeout));

    resetTimeout(); // Start the timer

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) =>
        window.removeEventListener(event, resetTimeout)
      );
    };
  }, [handleLogout]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Xin chào, {user.username}!</h2>
      {user.avatar ? (
        <img
          src={user.avatar}
          alt="Avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
      ) : (
        <p className="mb-4 text-gray-500">Không có ảnh đại diện</p>
      )}
      <p className="mb-2">Email: {user.email}</p>
      <p className="mb-4">Quyền quản trị: {user.isAdmin ? "Có" : "Không"}</p>
      <p className="mb-4">
        Ngày tạo tài khoản: {new Date(user.createdAt).toLocaleString()}
      </p>
      <p className="mb-4">
        Xác thực: {user.isVerified ? "Đã xác thực" : "Chưa xác thực"}
      </p>
      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
      >
        Đăng xuất
      </button>
      {message && <p className="mt-4 text-center text-green-500">{message}</p>}
    </div>
  );
};

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <h1 className="text-center text-red-500">
          Có lỗi xảy ra. Vui lòng thử lại.
        </h1>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
          localStorage.removeItem("savedEmail");
          localStorage.removeItem("savedPassword");
          localStorage.removeItem("rememberMe");
          document.cookie =
            "userInfo=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
          setMessage("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        }
      } else {
        setUser(null);
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
        localStorage.removeItem("rememberMe");
        document.cookie =
          "userInfo=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        setMessage(
          error.response?.data?.msg || "Lỗi khi lấy thông tin người dùng"
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");

    if (error === "auth_failed") {
      setMessage("Đăng nhập Google thất bại, vui lòng thử lại");
      setLoading(false);
      navigate("/login");
    } else {
      fetchUser();
    }
  }, [fetchUser, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Đang tải...
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/login"
            element={
              <LoginPage
                setUser={setUser}
                message={message}
                setMessage={setMessage}
              />
            }
          />
          <Route
            path="/home"
            element={<HomePage user={user} setUser={setUser} />}
          />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage setMessage={setMessage} />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
};

export default App;
