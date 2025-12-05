import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { auth, requireRole } from '../middleware/auth.js';
import {
    createTicketService,
    getTicketAgent,
    getTicketById,
    getTicketCustomer,
    getTicketStatusById,
    postCommentById
} from '../service/ticket.service.js';

const router = express.Router();

// File upload setup
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const absUploadDir = path.resolve(process.cwd(), uploadDir);
if (!fs.existsSync(absUploadDir)) fs.mkdirSync(absUploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, absUploadDir),
    filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// POST /tickets (customer)
router.post('/tickets', auth, upload.array('attachments'), createTicketService);

// GET /tickets/my (customer)
router.get('/tickets/my', auth, getTicketCustomer);

// GET /tickets (agent)
router.get('/tickets', auth, requireRole('agent'), getTicketAgent);

// GET /tickets/:id (agent)
router.get('/tickets/:id', auth, getTicketById);

// POST /tickets/:id/comment (agent)
router.post('/tickets/:id/comment', auth, postCommentById);


// PATCH /tickets/:id/status (agent)
router.patch('/tickets/:id/status', auth, requireRole('agent'), getTicketStatusById);

export default router;
