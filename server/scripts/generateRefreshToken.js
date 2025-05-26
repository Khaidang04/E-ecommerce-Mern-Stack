const { OAuth2Client } = require("google-auth-library");
const readline = require("readline");
require("dotenv").config();

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "urn:ietf:wg:oauth:2.0:oob"
);

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
});

console.log("Mở URL này để xác thực:", authUrl);

rl.question("Nhập mã xác thực: ", (code) => {
  rl.close();
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error("Lỗi lấy token:", err);
    console.log("Refresh Token:", token.refresh_token);
  });
});
