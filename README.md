🎫 Ticket Management System – Backend

📌 Overview
This backend powers a ticket management system where customers can create support tickets with attachments, and agents can manage, filter, and respond to them. It is built with Node.js, Express, MongoDB, and Multer for file handling.

🚀 Features
Authentication (JWT-based) for customers and agents
Ticket creation with:
Title, description, category, priority
Auto-priority option
File attachments
Ticket detail view with threaded comments

Agent dashboard:
View all tickets
Filter by status, priority, category, or search by title
See customer names
Update ticket status
Customer dashboard:
View own tickets
Reply to agent
File uploads served via /uploads

🛠️ Tech Stack
Node.js + Express – REST API
MongoDB + Mongoose – Database
Multer – File uploads
JWT – Authentication
Bootstrap/React – Frontend (separate repo)


⚙️ API Endpoints
🔑 Auth
POST /auth/register – Register user (customer/agent)
POST /auth/login – Login and get JWT

🎫 Tickets
POST /tickets – Create ticket (with attachments)
GET /tickets/:id – Get ticket detail (with comments)
PATCH /tickets/:id/status – Update ticket status (agent only)
GET /tickets/agent – Get all tickets (agent view, with filters + customer name)
GET /tickets/customer – Get customer’s own tickets

💬 Comments
POST /tickets/:id/comment – Add comment (customer or agent)