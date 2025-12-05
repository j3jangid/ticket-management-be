import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ['open', 'in_progress', 'closed'],
            default: 'open'
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'low'
        },
        category: {
            type: String,
            enum: ['Billing', 'Technical', 'Account'],
            default: 'Technical'
        },
        attachments: [{ type: String }],
    },
    { timestamps: true }
);

export default mongoose.model('Ticket', ticketSchema);
