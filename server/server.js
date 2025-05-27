const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const dbConnect = require("./dbConnect/dbConnection");
const routes = require("./routes/routes");

require("dotenv").config();
require("./config/passport");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Define rate limiter before using it
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit 100 requests per IP
  message: "Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút.",
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit 5 login attempts
  message: "Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 15 phút.",
});

// Apply rate limiters
app.use(limiter);
app.use("/api/v1/auth/login", loginLimiter);

app.use(morgan("combined"));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.JWT_KEY || "your_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Đã xảy ra lỗi server",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 4000;
dbConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT} at ${new Date().toLocaleString()}`
      );
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });