Authentication System
======================

Full-stack email/OTP authentication built with React (Vite) on the frontend and Express/MongoDB on the backend. Users can register, log in with httpOnly JWT cookies, verify email via 6-digit OTP, and reset passwords via email OTP.

Features
--------
- Register/login with bcrypt-hashed passwords and signed JWT cookies.
- Email verification: 6-digit OTP via SMTP (24-hour expiry).
- Password reset: email OTP (10-minute expiry) and forced invalidation after use.
- Auth guard middleware (`userAuth`) for protected API routes.
- React SPA with login/signup, email verify, and reset flows plus toast notifications.

Tech Stack
----------
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, Nodemailer (SMTP).
- Frontend: React 19, Vite, React Router, React Toastify.

Project Structure
-----------------
- `backend/`: Express API (`server.js`, routes/controllers, MongoDB and Nodemailer config, auth middleware, Mongoose models).
- `frontend/`: React SPA (pages/components, auth context, Vite tooling).

Setup
-----
1) Backend env: create `backend/.env`:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=replace_me_with_a_long_random_string
SMTP_HOST=smtp.gmail.com              # or Brevo/your SMTP host
SMTP_PORT=465                         # 465 for SSL, 587 for STARTTLS
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password_or_app_password
SENDER_EMAIL=you@example.com
```
2) Frontend env: create `frontend/.env`:
```
VITE_BACKEND_URL=http://localhost:4000
```
3) Install deps:
- `cd backend && npm install`
- `cd frontend && npm install`
4) Run:
- Backend: `cd backend && npm run server` (or `npm start`)
- Frontend: `cd frontend && npm run dev`
5) Visit `http://localhost:5173`. If you deploy elsewhere, update CORS allowlist in `backend/server.js`.

Auth Flows (manual test)
------------------------
- Register: creates user, sets JWT cookie, sends welcome email.
- Verify email: click “Verify Email” in navbar, enter 6-digit code (24h validity).
- Login: sets JWT cookie; protected routes read it via `userAuth`.
- Password reset: request OTP, enter OTP + new password within 10 minutes; UI redirects to Login after success.

Notes
-----
- Cookies are httpOnly and respect `NODE_ENV` for secure/sameSite.
- OTPs are single-use and cleared after successful verification/reset.
