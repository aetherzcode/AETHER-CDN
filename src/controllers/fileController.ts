import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { sendEmail } from '../services/emailService';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const randomString = Math.random().toString(36).substring(2, 10);
    const ext = path.extname(file.originalname);
    cb(null, `${randomString}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadFile = upload.single("file");

export const getHome = (req: Request, res: Response) => {
  res.render("index", { title: "Home | AETHER - CDN" });
};

export const getAbout = (req: Request, res: Response) => {
  res.render("about", { title: "About | AETHER - CDN" });
};

export const getContact = (req: Request, res: Response) => {
  res.render("contact", { title: "Contact | AETHER - CDN" });
};

export const getDocs = (req: Request, res: Response) => {
  res.render("docs", { title: "Docs | AETHER - CDN" });
};

export const handleUpload = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.redirect(`/data/${req.file.filename}`);
};

export const getData = (req: Request, res: Response) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../../uploads", filename);

  if (fs.existsSync(filePath)) {
    res.render("result", {
      title: "File Result | AETHER - CDN",
      fileUrl: `${req.protocol}://${req.get("host")}/f/${filename}`,
      filename,
    });
  } else {
    res.status(404).send("File not found");
  };
};

export const apiUpload = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const protocol = req.headers['x-forwarded-proto'] || req.protocol;

  res.json({
    status: 200,
    creator: "AETHER.",
    data: {
      originalname: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `${protocol}://${req.get("host")}/f/${req.file.filename}`,
    },
  });
}; 

export const handleContactForm = async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  try {
    const emailSent = await sendEmail(name, email, message);
    if (emailSent) {
      res.status(200).json({ message: 'Message sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send message' });
    }
  } catch (error) {
    console.error('Error in handleContactForm:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
