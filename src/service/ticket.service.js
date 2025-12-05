import Ticket from '../models/Ticket.js';
import Comment from '../models/Comment.js';
import successResponse from '../config/successResponse.js';
import { AppError } from '../config/AppError.js';

export async function createTicketService(req, res) {
    const files = req.files || []; // safe guard
    const { title, description, category, priority, autoPriority } = req.body;
    if (!title.trim() || title.trim().length < 3) throw new AppError(400, 'Title should more then 3 Char')
    if (!description.trim() || description.trim().length < 5) throw new AppError(400, 'Description should more then 5 Char')
    if (!category.trim()) throw new AppError(400, 'category required')

    const ticket = await Ticket.create({
        title,
        description,
        category,
        priority,
        autoPriority,
        customerId: req.user._id,
        attachments: files.map(f => `/uploads/${f.filename}`),
    });
    return successResponse(res, 201, 'Ticket Create Successfully', ticket)
}

export async function getTicketCustomer(req, res) {
    if (req.user.role !== 'customer') throw new AppError(403, 'Only customers can view their tickets')
    const tickets = await Ticket.find({ customerId: req.user._id }).sort({ createdAt: -1 });
    return successResponse(res, 200, 'Ticket fetched Successfully', tickets)
}

export async function getTicketAgent(req, res) {
    const { status, priority, category, q } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (q) filter.title = { $regex: q, $options: 'i' };

    const tickets = await Ticket.find(filter)
        .populate('customerId', 'name') // ✅ populate only the name field
        .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Ticket Fetched Successfully', tickets)
}

export async function getTicketById(req, res) {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) throw new AppError(404, 'Not found')

    // Access control: customers can only view their own tickets
    if (req.user.role === 'customer' && ticket.customerId.toString() !== req.user._id.toString()) {
        throw new AppError(403, 'Forbidden')
    }

    // ✅ Populate author name from User model
    const comments = await Comment.find({ ticketId: ticket._id })
        .sort({ createdAt: 1 })
        .populate('authorId', 'name');

    return successResponse(res, 200, 'Ticket Fetched Succesfully', { ticket, comments })
}


export async function postCommentById(req, res) {
    const { message } = req.body;
    if (!message.trim() || message.trim().length < 5) throw new AppError(400, 'Message Should be More then 5 Char')

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) throw new AppError(404, 'Ticket not found')

    // ✅ Customers can only comment on their own tickets
    if (req.user.role === 'customer' && ticket.customerId.toString() !== req.user._id.toString()) {
        throw new AppError(403, 'Forbidden')
    }

    const comment = await Comment.create({
        ticketId: ticket._id,
        authorId: req.user._id,
        authorRole: req.user.role,
        message,
    });

    return successResponse(res, 200, 'Ticket Fetched Succesfully', comment)
}


export async function getTicketStatusById(req, res) {
    const { status } = req.body;
    if (!['in_progress', 'closed'].includes(status)) throw new AppError(400, 'Invalid status')

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) throw new AppError(404, 'Not found')

    if (ticket.status === 'open' && status !== 'in_progress') {
        throw new AppError(400, 'open -> in_progress only')
    }
    if (ticket.status === 'in_progress' && status !== 'closed') {
        throw new AppError(400, 'in_progress -> closed only')
    }

    ticket.status = status;
    await ticket.save();
    return successResponse(res, 200, 'Ticket Fetched Succesfully', ticket)
}