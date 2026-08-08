import { Request, Response, Router } from "express";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = Router();

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3001";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

const REDIRECT_URI = `${BACKEND_URL}/api/auth/google/callback`;

const oauth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

router.get("/", (req: Request, res: Response) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    res.status(500).json({ message: "Google OAuth is not configured" });
    return;
  }

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "online",
    scope: ["openid", "email", "profile"],
    prompt: "select_account",
  });

  res.redirect(authUrl);
});

router.get("/callback", async (req: Request, res: Response) => {
  const fail = (error: string) => {
    res.redirect(`${FRONTEND_URL}/login?error=${error}`);
  };

  try {
    const code = typeof req.query.code === "string" ? req.query.code : "";
    if (!code) {
      fail("google_missing_code");
      return;
    }

    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens.id_token) {
      fail("google_invalid_token");
      return;
    }

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      fail("google_no_email");
      return;
    }

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        name: payload.name || payload.email.split("@")[0],
        email: payload.email,
        password: crypto.randomBytes(32).toString("hex"),
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      fail("jwt_not_configured");
      return;
    }

    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "7d" });

    res.redirect(`${FRONTEND_URL}/login?token=${token}`);
  } catch (err) {
    fail("google_auth_failed");
  }
});

export default router;
