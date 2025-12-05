import express from 'express';
import { userLoginService, userRegisterService } from '../service/auth.service.js';

const router = express.Router();

// POST /auth/register
router.post('/register', userRegisterService);

// POST /auth/login
router.post('/login', userLoginService);

export default router;
