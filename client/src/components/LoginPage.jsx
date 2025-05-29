import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import ReCAPTCHA from "react-google-recaptcha";
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

// Translation object for multi-language support
const translations = {
  vi: {
    title: {
      login: "Đăng Nhập Ngay",
      register: "Đăng Ký Tài Khoản",
      forgotPassword: "Khôi Phục Mật Khẩu",
    },
    username: "Tên người dùng",
    avatar: "Ảnh đại diện",
    email: "Email",
    password: "Mật khẩu",
    rememberMe: "Ghi nhớ tôi",
    captchaError: "Vui lòng xác thực CAPTCHA",
    captchaExpired: "CAPTCHA đã hết hạn, vui lòng thử lại",
    login: "Đăng Nhập",
    register: "Đăng Ký",
    forgotPassword: "Quên Mật Khẩu",
    sendResetLink: "Gửi Liên Kết Đặt Lại",
    googleLogin: "Đăng Nhập với Google",
    loginFailed: "Email hoặc mật khẩu không đúng",
    tooManyAttempts:
      "Bạn đã nhập sai quá số lần quy định, vui lòng thử lại sau 30 giây.",
    processing: "Đang xử lý...",
    loggingIn: "Đang đăng nhập...",
    language: "Ngôn ngữ",
  },
  en: {
    title: {
      login: "Login Now",
      register: "Register Account",
      forgotPassword: "Recover Password",
    },
    username: "Username",
    avatar: "Avatar",
    email: "Email",
    password: "Password",
    rememberMe: "Remember Me",
    captchaError: "Please verify CAPTCHA",
    captchaExpired: "CAPTCHA has expired, please try again",
    login: "Login",
    register: "Register",
    forgotPassword: "Forgot Password",
    sendResetLink: "Send Reset Link",
    googleLogin: "Login with Google",
    loginFailed: "Incorrect email or password",
    tooManyAttempts:
      "Too many failed attempts, please try again in 30 seconds.",
    processing: "Processing...",
    loggingIn: "Logging in...",
    language: "Language",
  },
  es: {
    title: {
      login: "Iniciar Sesión Ahora",
      register: "Registrar Cuenta",
      forgotPassword: "Recuperar Contraseña",
    },
    username: "Nombre de usuario",
    avatar: "Avatar",
    email: "Correo electrónico",
    password: "Contraseña",
    rememberMe: "Recuérdame",
    captchaError: "Por favor verifica el CAPTCHA",
    captchaExpired: "El CAPTCHA ha expirado, por favor intenta de nuevo",
    login: "Iniciar Sesión",
    register: "Registrar",
    forgotPassword: "Olvidé mi Contraseña",
    sendResetLink: "Enviar Enlace de Restablecimiento",
    googleLogin: "Iniciar Sesión con Google",
    loginFailed: "Correo electrónico o contraseña incorrectos",
    tooManyAttempts:
      "Demasiados intentos fallidos, por favor intenta de nuevo en 30 segundos.",
    processing: "Procesando...",
    loggingIn: "Iniciando sesión...",
    language: "Idioma",
  },
  fr: {
    title: {
      login: "Se Connecter Maintenant",
      register: "Créer un Compte",
      forgotPassword: "Récupérer le Mot de Passe",
    },
    username: "Nom d'utilisateur",
    avatar: "Avatar",
    email: "Email",
    password: "Mot de passe",
    rememberMe: "Se souvenir de moi",
    captchaError: "Veuillez vérifier le CAPTCHA",
    captchaExpired: "Le CAPTCHA a expiré, veuillez réessayer",
    login: "Se Connecter",
    register: "S'inscrire",
    forgotPassword: "Mot de Passe Oublié",
    sendResetLink: "Envoyer le Lien de Réinitialisation",
    googleLogin: "Se Connecter avec Google",
    loginFailed: "Email ou mot de passe incorrect",
    tooManyAttempts:
      "Trop de tentatives échouées, veuillez réessayer dans 30 secondes.",
    processing: "Traitement...",
    loggingIn: "Connexion en cours...",
    language: "Langue",
  },
  de: {
    title: {
      login: "Jetzt Anmelden",
      register: "Konto Registrieren",
      forgotPassword: "Passwort Wiederherstellen",
    },
    username: "Benutzername",
    avatar: "Avatar",
    email: "E-Mail",
    password: "Passwort",
    rememberMe: "An mich erinnern",
    captchaError: "Bitte verifizieren Sie das CAPTCHA",
    captchaExpired: "Das CAPTCHA ist abgelaufen, bitte versuchen Sie es erneut",
    login: "Anmelden",
    register: "Registrieren",
    forgotPassword: "Passwort Vergessen",
    sendResetLink: "Link zum Zurücksetzen Senden",
    googleLogin: "Mit Google Anmelden",
    loginFailed: "E-Mail oder Passwort falsch",
    tooManyAttempts:
      "Zu viele fehlgeschlagene Versuche, bitte in 30 Sekunden erneut versuchen.",
    processing: "Verarbeitung...",
    loggingIn: "Anmeldung läuft...",
    language: "Sprache",
  },
  ja: {
    title: {
      login: "今すぐログイン",
      register: "アカウント登録",
      forgotPassword: "パスワードを回復",
    },
    username: "ユーザー名",
    avatar: "アバター",
    email: "メール",
    password: "パスワード",
    rememberMe: "ログイン情報を保存",
    captchaError: "CAPTCHAを認証してください",
    captchaExpired: "CAPTCHAが期限切れです、もう一度お試しください",
    login: "ログイン",
    register: "登録",
    forgotPassword: "パスワードを忘れた",
    sendResetLink: "リセットリンクを送信",
    googleLogin: "Googleでログイン",
    loginFailed: "メールまたはパスワードが正しくありません",
    tooManyAttempts: "失敗した試行が多すぎます、30秒後に再度お試しください。",
    processing: "処理中...",
    loggingIn: "ログイン中...",
    language: "言語",
  },
};

const LoginPage = ({
  setUser,
  message,
  setMessage,
  language = "vi",
  setLanguage,
}) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const recaptchaRef = useRef(null);

  // Ensure language is valid, default to "vi" if not
  const validLanguage = translations[language] ? language : "vi";
  const t = translations[validLanguage]; // Translation shorthand

  // Handle lockout timer for brute-force protection
  useEffect(() => {
    if (isLocked && lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (lockoutTime <= 0 && isLocked) {
      setIsLocked(false);
      setFailedAttempts(0);
    }
  }, [isLocked, lockoutTime]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear errors when user types
    if (name === "email") setEmailError("");
    if (name === "password") setPasswordError("");
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    if (!token) {
      setMessage(t.captchaExpired);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailError("");
    setPasswordError("");
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLocked) {
      setMessage(t.tooManyAttempts);
      return;
    }
    if (!captchaToken && !isRegister) {
      setMessage(t.captchaError);
      return;
    }
    setIsLoading(true);
    setEmailError("");
    setPasswordError("");
    try {
      const { data } = await axios.post("/auth/login", {
        email: formData.email,
        password: formData.password,
        captchaToken,
      });
      setUser(data.data);
      // Store token in localStorage or sessionStorage based on "Remember Me"
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("authToken", data.token || "mock-token");
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
      setFailedAttempts(0); // Reset failed attempts on successful login
      navigate("/home", { replace: true });
    } catch (error) {
      setFailedAttempts((prev) => prev + 1);
      if (failedAttempts + 1 >= 3) {
        setIsLocked(true);
        setLockoutTime(30);
        setMessage(t.tooManyAttempts);
      } else {
        setEmailError(t.loginFailed);
        setPasswordError(t.loginFailed);
        setMessage(error.response?.data?.msg || "Đã có lỗi xảy ra");
      }
      if (error.response?.data?.msg?.includes("CAPTCHA")) {
        recaptchaRef.current.reset();
        setCaptchaToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      setMessage(t.captchaError);
      return;
    }
    setIsLoading(true);
    setEmailError("");
    try {
      const { data } = await axios.post("/auth/forgot-password", {
        email: formData.email,
        captchaToken,
      });
      setMessage(data.msg || "Liên kết đặt lại mật khẩu đã được gửi!");
      setIsForgotPassword(false);
      setCaptchaToken(null);
      setFormData({ ...formData, email: "", password: "" });
    } catch (error) {
      setEmailError(error.response?.data?.msg || "Đã có lỗi xảy ra");
      if (error.response?.data?.msg?.includes("CAPTCHA")) {
        recaptchaRef.current.reset();
        setCaptchaToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/api/v1/auth/google";
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

  const getMessageStyles = () => {
    if (theme === "light") {
      return { color: "#10B981", backgroundColor: "rgba(209, 250, 229, 0.8)" };
    } else if (theme === "dark") {
      return { color: "#34D399", backgroundColor: "rgba(26, 46, 42, 0.8)" };
    } else {
      return { color: "#059669", backgroundColor: "rgba(209, 250, 229, 0.8)" };
    }
  };

  const getInputStyles = () => {
    if (theme === "light") {
      return {
        backgroundColor: "transparent",
        color: lightColors.text,
        borderColor: "rgba(156, 163, 175, 0.5)",
        transition: "all 0.3s ease",
      };
    } else if (theme === "dark") {
      return {
        backgroundColor: "transparent",
        color: darkColors.text,
        borderColor: "rgba(75, 85, 99, 0.5)",
        transition: "all 0.3s ease",
      };
    } else {
      return {
        backgroundColor: "transparent",
        color: "#4A4A4A",
        borderColor: "rgba(156, 163, 175, 0.5)",
        transition: "all 0.3s ease",
      };
    }
  };

  const getFormStyles = () => {
    if (theme === "light") {
      return {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        color: lightColors.text,
        borderColor: "rgba(156, 163, 175, 0.2)",
      };
    } else if (theme === "dark") {
      return {
        backgroundColor: "rgba(31, 41, 55, 0.9)",
        color: darkColors.text,
        borderColor: "rgba(75, 85, 99, 0.2)",
      };
    } else {
      return {
        backgroundColor: "rgba(255, 247, 230, 0.9)",
        color: "#4A4A4A",
        borderColor: "rgba(156, 163, 175, 0.2)",
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

  // Animation variants for Framer Motion
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3, ease: "easeIn" } },
  };

  const labelVariants = {
    rest: { y: 0, fontSize: "0.875rem", transition: { duration: 0.2 } },
    focus: {
      y: -20,
      fontSize: "0.75rem",
      color: "#3B82F6",
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        key="login-page"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={formVariants}
        className="flex items-center justify-center min-h-screen px-4"
      >
        <div
          className="w-full max-w-md rounded-xl p-8 shadow-lg border"
          style={getFormStyles()}
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2 } }}
            className="text-2xl font-bold text-center mb-6 tracking-wide"
            style={{ color: getFormStyles().color }}
          >
            {isRegister
              ? t.title.register
              : isForgotPassword
              ? t.title.forgotPassword
              : t.title.login}{" "}
            <span className="text-blue-400 font-extrabold">EcommerceMern</span>
          </motion.h2>

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
            className="space-y-5"
          >
            {isRegister && (
              <>
                <div className="relative">
                  <motion.label
                    className="flex items-center text-sm font-medium mb-2 absolute top-2 left-0"
                    variants={labelVariants}
                    initial="rest"
                    animate={formData.username ? "focus" : "rest"}
                    style={getTextStyles()}
                  >
                    <UserIcon className="h-5 w-5 mr-2 text-blue-400" />
                    {t.username}
                  </motion.label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-transparent border-b-2 focus:border-blue-400 focus:outline-none transition-all duration-300 placeholder-transparent pt-6"
                    style={getInputStyles()}
                    required
                    autoComplete="username"
                    placeholder=""
                  />
                </div>
                <div className="relative">
                  <motion.label
                    className="flex items-center text-sm font-medium mb-2 absolute top-2 left-0"
                    variants={labelVariants}
                    initial="rest"
                    animate={formData.avatar ? "focus" : "rest"}
                    style={getTextStyles()}
                  >
                    <UserIcon className="h-5 w-5 mr-2 text-blue-400" />
                    {t.avatar}
                  </motion.label>
                  <input
                    type="file"
                    name="avatar"
                    onChange={handleChange}
                    accept="image/*"
                    className="w-full px-4 py-2 bg-transparent border-b-2 focus:border-blue-400 focus:outline-none transition-all duration-300 pt-6"
                    style={getInputStyles()}
                  />
                </div>
              </>
            )}
            <div className="relative">
              <motion.label
                className="flex items-center text-sm font-medium mb-2 absolute top-2 left-0"
                variants={labelVariants}
                initial="rest"
                animate={formData.email ? "focus" : "rest"}
                style={getTextStyles()}
              >
                <EnvelopeIcon className="h-5 w-5 mr-2 text-blue-400" />
                {t.email}
              </motion.label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-transparent border-b-2 focus:border-blue-400 focus:outline-none transition-all duration-300 placeholder-transparent pt-6"
                style={getInputStyles()}
                required
                autoComplete="email"
                id="email"
                placeholder=""
              />
              {emailError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-xs mt-1"
                >
                  {emailError}
                </motion.p>
              )}
            </div>
            {!isForgotPassword && (
              <div className="relative">
                <motion.label
                  className="flex items-center text-sm font-medium mb-2 absolute top-2 left-0"
                  variants={labelVariants}
                  initial="rest"
                  animate={formData.password ? "focus" : "rest"}
                  style={getTextStyles()}
                >
                  <LockClosedIcon className="h-5 w-5 mr-2 text-blue-400" />
                  {t.password}
                </motion.label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-transparent border-b-2 focus:border-blue-400 focus:outline-none transition-all duration-300 placeholder-transparent pt-6"
                  style={getInputStyles()}
                  required
                  autoComplete="current-password"
                  id="password"
                  placeholder=""
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:text-blue-400"
                  style={getTextStyles()}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
                {passwordError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-1"
                  >
                    {passwordError}
                  </motion.p>
                )}
              </div>
            )}
            {!isRegister && !isForgotPassword && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 rounded text-blue-500 focus:ring-blue-400 bg-transparent border-gray-500"
                />
                <label
                  className="flex items-center text-sm"
                  style={getTextStyles()}
                >
                  <CheckCircleIcon className="h-5 w-5 mr-2 text-blue-400" />
                  {t.rememberMe}
                </label>
              </div>
            )}
            {(!isRegister && !isForgotPassword) || isForgotPassword ? (
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                  onChange={handleCaptchaChange}
                  theme={theme}
                  size="normal"
                  hl={validLanguage}
                  className="transform transition-all duration-300 hover:scale-105"
                />
              </div>
            ) : null}
            <motion.button
              type="submit"
              disabled={isLoading || isLocked}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 rounded-lg font-semibold text-lg flex items-center justify-center transition-all duration-300 ease-in-out transform hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={getSecondaryThemeStyles()}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isRegister
                    ? t.processing
                    : isForgotPassword
                    ? t.processing
                    : t.loggingIn}
                </div>
              ) : (
                <>
                  <ArrowRightIcon className="h-5 w-5 mr-2" />
                  {isRegister
                    ? t.register
                    : isForgotPassword
                    ? t.sendResetLink
                    : t.login}
                </>
              )}
            </motion.button>
          </form>
          <div className="mt-4 flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsRegister(!isRegister);
                setIsForgotPassword(false);
                setMessage("");
                setCaptchaToken(null);
              }}
              className="flex-1 py-2 rounded-lg font-medium hover:bg-gray-200/30 transition-all duration-300 flex items-center justify-center"
              style={getTextStyles()}
            >
              <ArrowRightIcon className="h-5 w-5 mr-2 text-blue-400" />
              {isRegister ? t.login : t.register}
            </motion.button>
            {!isRegister && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsForgotPassword(true);
                  setMessage("");
                  setCaptchaToken(null);
                }}
                className="flex-1 py-2 rounded-lg font-medium hover:bg-gray-200/30 transition-all duration-300 flex items-center justify-center"
                style={getTextStyles()}
              >
                <LockClosedIcon className="h-5 w-5 mr-2 text-blue-400" />
                {t.forgotPassword}
              </motion.button>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleLogin}
            className="w-full mt-4 py-3 rounded-lg font-semibold text-lg flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 ease-in-out transform"
          >
            <GlobeAltIcon className="h-5 w-5 mr-2" />
            {t.googleLogin}
          </motion.button>
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center text-sm font-medium p-2 rounded-lg"
              style={getMessageStyles()}
            >
              {message}
            </motion.p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginPage;
