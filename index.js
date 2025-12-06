import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import url from 'url';
import connectDB from './src/config/connectDB.js';
import authRoutes from './src/router/auth.routes.js';
import ticketRoutes from './src/router/ticket.routes.js';
import errorHandler from './src/middleware/errorHandler.js';

dotenv.config();

const PORT = process.env.PORT || 3534;
const app = express();

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
    origin: "https://ticket-management-fe.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.resolve(__dirname, uploadDir)));

// Health check
app.get('/', (req, res) => res.send('hii from BE'));

// Routes
app.use('/auth', authRoutes);
app.use('/', ticketRoutes);

// Handle Error Middleware
app.use(errorHandler)

// Start server
connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Server Running on ${PORT}`));
    })
    .catch((err) => console.error('Error While Connecting DB:', err));
