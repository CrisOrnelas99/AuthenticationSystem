Authentication System
======================

Full-stack email/OTP authentication flow built with React (Vite) on the frontend and Express/MongoDB on the backend. Users can register, log in with httpOnly JWT cookies, verify their email via a 6-digit OTP, and request password resets through emailed OTPs.

Features
--------
- Register/login with bcrypt-hashed passwords and signed JWT cookies.
- Email verification: 6-digit OTP sent via SMTP (Brevo relay) with 24-hour expiry.
- Password reset: email OTP with 10-minute expiry and enforced reuse invalidation.
- Auth guard middleware (`userAuth`) for protected API routes and user data fetch.
- React SPA with verification/login screens, toast notifications, and shared app context.

Tech Stack
----------
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, Nodemailer (SMTP relay).
- Frontend: React 19, Vite, React Router, React Toastify, Tailwind-style utility classes.

Project Structure
-----------------
- `backend/`: Express API (`server.js`, routes/controllers, MongoDB and Nodemailer config, auth middleware, Mongoose models).
- `frontend/`: React SPA (pages/components, context for auth state, Vite build tooling).

Setup
-----
1) Clone and open the project.  
2) Backend env: create `backend/.env`:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=replace_me_with_a_long_random_string
SMTP_USER=your_smtp_username          # Brevo/SMTP relay user
SMTP_PASS=your_smtp_password          # Brevo/SMTP relay password
SENDER_EMAIL=you@example.com          # From address for outgoing emails
```
3) Frontend env: create `frontend/.env`:
```
VITE_BACKEND_URL=http://localhost:4000
```
4) Install deps:
- `cd backend && npm install`
- `cd frontend && npm install`
5) Run the stack in two terminals:
- Backend: `cd backend && npm run server` (or `npm start`)
- Frontend: `cd frontend && npm run dev`
6) Visit `http://localhost:5173` and use the app. The backend CORS allowlist currently expects `http://localhost:5173` (update `allowedOrigins` in `backend/server.js` if you deploy elsewhere).

Auth Flows (manual test)
------------------------
- Register → backend creates user, sets JWT httpOnly cookie, sends welcome email.
- Verify email → trigger “send verification OTP”, enter the 6-digit code within 24h to mark the account verified.
- Login → sets JWT cookie; protected routes use `userAuth` middleware to decode it.
- Password reset → request reset OTP by email, enter code + new password within 10 minutes.

Notes
-----
- Cookies are httpOnly and respect `NODE_ENV` for secure/sameSite settings.
- OTPs are single-use and cleared after successful verification/reset.
