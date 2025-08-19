# Endorsesphere Backend

Backend service built with **Node.js**, **Express**, and **MongoDB** to handle authentication, content management, and analytics for Endorsesphere.  

## Features
### Authentication
- `POST /auth/signup` – Register a new user (default role: `user`)  
- `POST /auth/login` – Authenticate user and return JWT  

### Content Management
- `POST /content` – Create content (user only)  
- `GET /content` – Admin: fetch all content, User: fetch own content  
- `PUT /content/:id/approve` – Approve content (admin only)  
- `PUT /content/:id/reject` – Reject content (admin only)  

### Advanced APIs
- `GET /content/stats` – Content analytics (counts by status)  
- `GET /content/search?status=&keyword=` – Search and filter content  
- `GET /content/recent` – Recent activity feed (last 5 approved/rejected items)  

### Middleware
- JWT authentication  
- Role-based access control  

### Featues
- Pagination and advanced filtering for content lists
- Email notifications when content is approved or rejected
- Analytics visualization support (pending vs approved) for admin dashboard

### Deployment
Backend is hosted on Render.  
Base URL: https://webapp-endorsesphere-backend.onrender.com