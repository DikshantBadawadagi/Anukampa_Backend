import express from 'express';
import { signin, signup } from '../controllers/volunteerAuth.js';

const router  = express.Router();

router.post("/volunteer/signup",signup)

router.post("/volunteer/signin",signin)