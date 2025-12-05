import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import { AppError } from "../config/AppError.js"
import successResponse from '../config/successResponse.js';

export async function userRegisterService(req, res) {
    const { name, email, password, role } = req.body;
    if (!name.trim() || name.trim().length < 3) throw new AppError(400, 'Name Should be three or more Char');
    if (!email.trim()) throw new AppError(400, 'Email Required');
    if (!password.trim() || password.trim().length < 5) throw new AppError(400, 'Password Should be five or more Char');

    const existing = await User.findOne({ email });
    if (existing) throw new AppError(409, "Email already registered")

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hash, role: role || 'customer' });

    return successResponse(res, 201, 'User Create Succesfully', { id: user._id, email: user.email, role: user.role })
}

export async function userLoginService(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new AppError(401, 'Invalid credentials')

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new AppError(401, 'Invalid credentials')

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return successResponse(res, 200, 'User Logged in successfully', {
        token,
        user: { id: user._id, email: user.email, name: user.name, role: user.role },
    })
}