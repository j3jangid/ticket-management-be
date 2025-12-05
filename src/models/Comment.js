import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
    {
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
            required: true
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        authorRole: {
            type: String,
            enum: ['customer', 'agent'],
            required: true
        },
        message: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
);

export default mongoose.model('Comment', commentSchema);
