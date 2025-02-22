import express from 'express';
import { signin, signup } from '../controllers/ngoAuth.js';

const router = express.Router();

router.post("/ngo/signup",signup)

router.post("/ngo/signin",signin)

export default router;