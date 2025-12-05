import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../config/AppError.js';

export const auth = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new AppError(401, 'Missing token')

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(payload.id).select('_id role name email');

  if (!user) throw new AppError(401, 'Missing token')
  req.user = user;
  next();
};

export const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) throw new AppError(401, 'Forbidden')
  next();
};
