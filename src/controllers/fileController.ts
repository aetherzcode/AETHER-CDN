import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from 'nodemailer';
import axios from 'axios';

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
  limits: { fileSize: 50 * 1024 * 1024 },
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
      title: "File Result | AETHER CDN",
      fileUrl: `${req.protocol}://${req.get("host")}/f/${filename}`,
      filename,
    });
  } else {
    res.status(404).send("File not found");
  }
};

export const apiUpload = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const protocol = req.headers["x-forwarded-proto"] || req.protocol;

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

export const sendEmail = async (req: Request, res: Response) => {
    const { name, email, message } = req.body;

    // Konfigurasi transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'aetherscode@gmail.com', // Ganti dengan email Anda
            pass: 'ihsynmfecsxgzmfr', // Ganti dengan password email Anda
        },
    });

    const mailOptions = {
        from: email,
        to: 'princeaether04@gmail.com', // Ganti dengan email tujuan
        subject: 'New Message From AETHER - CDN',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f4f4f4; border-radius: 8px; text-align: center;">
                <h2 style="color: #333;">New Message from AETHER - CDN</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p style="background-color: #fff; padding: 10px; border-radius: 4px; border: 1px solid #ddd;">${message}</p>
                <br>
                <img src="cid:logo" alt="Logo" style="width: 100px; height: auto; border-radius: 50%; display: block; margin: 20px auto;"/>
            </div>
        `,
        attachments: [
            {
                filename: 'logo.jpg',
                path: 'public/images/logo.jpg',
                cid: 'logo'
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
        res.redirect('/contact?success=true');
    } catch (error) {
        console.error('Error sending email:', error);
        res.redirect('/contact?error=true');
    }
};
