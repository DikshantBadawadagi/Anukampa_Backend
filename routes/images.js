import express from "express";
import { ensureUserExists } from "../middleware/userExists.js";
import {addImage, testImage} from "../controllers/image.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/", ensureUserExists, testImage);
router.post("/", ensureUserExists,upload.single('image'), addImage);

export default router;