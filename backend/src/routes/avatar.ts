import { Request, Response, Router } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import User from "../models/User";
import auth from "../middleware/auth";

const router = Router();

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

const ALLOWED_MIMETYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || ".png";
      cb(null, `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`);
    },
  }),
  limits: { fileSize: MAX_AVATAR_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const uploadAvatar = (req: Request, res: Response, next: import("express").NextFunction) => {
  upload.single("avatar")(req, res, (err: unknown) => {
    if (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      res.status(400).json({ message });
      return;
    }
    next();
  });
};

router.post("/", auth, uploadAvatar, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      if (!req.file) {
        res.status(400).json({ message: "avatar file is required" });
        return;
      }

      const avatar = `/uploads/${req.file.filename}`;
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { avatar },
        { new: true }
      ).select("-password");

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json({ user });
    } catch (err) {
      res
        .status(400)
        .json({ message: err instanceof Error ? err.message : "Upload failed" });
    }
  }
);

export default router;
