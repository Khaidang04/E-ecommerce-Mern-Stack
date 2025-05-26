import React, { useState, useEffect, useCallback } from "react";
import {
  Routes,
  Route,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";
import axios from "axios";

// Configure Axios defaults
axios.defaults.baseURL = "http://localhost:4000/api/v1";
axios.defaults.withCredentials = true;

const LoginPage = ({ setUser, message, setMessage }) => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "avatar") {
      setFormData({ ...formData, avatar: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
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
      setMessage(data.msg);
      setIsRegister(false);
      setFormData({ username: "", email: "", password: "", avatar: null });
    } catch (error) {
      setMessage(error.response?.data?.msg || "Đã có lỗi xảy ra");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      setUser(data.data);
      setMessage("Đăng nhập thành công!");
      navigate("/home");
    } catch (error) {
      setMessage(error.response?.data?.msg || "Đã có lỗi xảy ra");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/auth/forgot-password", {
        email: formData.email,
      });
      setMessage(data.msg);
      setIsForgotPassword(false);
    } catch (error) {
      setMessage(error.response?.data?.msg || "Đã có lỗi xảy ra");
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
          />
        </div>
        {!isForgotPassword && (
          <div className="mb-6">
            <label className="block text-gray-700">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
        )}
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
  const [isValidToken, setIsValidToken] = useState(null);
  const [error, setError] = useState(null);

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
      setMessage(data.msg);
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.msg || "Đã có lỗi xảy ra");
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
        <div className="mb-6">
          <label className="block text-gray-700">Mật khẩu mới</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Đặt lại Mật khẩu
        </button>
      </form>
    </div>
  );
};

const HomePage = ({ user, setUser, message, setMessage }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(null);
      document.cookie =
        "userInfo=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      setMessage("Đã đăng xuất thành công");
      navigate("/login");
    } catch (error) {
      setMessage("Đã có lỗi khi đăng xuất");
    }
  };

  if (!user) {
    navigate("/login");
    return null;
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
        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200"
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
          Đã có lỗi xảy ra. Vui lòng thử lại.
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
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");

    if (error === "auth_failed") {
      setMessage("Đăng nhập Google thất bại, vui lòng thử lại");
      setLoading(false);
      navigate("/login");
    } else {
      // Luôn gọi API để lấy thông tin người dùng mới nhất từ server
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
            element={
              <HomePage
                user={user}
                setUser={setUser}
                message={message}
                setMessage={setMessage}
              />
            }
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
