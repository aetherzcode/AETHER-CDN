import { Router } from "express";
import {
  uploadFile,
  getHome,
  getAbout,
  getContact,
  getDocs,
  handleUpload,
  getData,
  apiUpload,
  handleContactForm,
} from "../controllers/fileController";

const router = Router();

router.get("/", getHome);
router.get("/about", getAbout);
router.get("/contact", getContact);
router.get("/docs", getDocs);
router.post("/upload", uploadFile, handleUpload);
router.get("/data/:filename", getData);
router.post("/api/upload", uploadFile, apiUpload);
router.post("/send-message", handleContactForm);

export default router;
