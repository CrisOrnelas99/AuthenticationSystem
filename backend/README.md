# Authentication System Backend

Express + MongoDB API that issues JWT cookies, handles registration/login, email verification OTP, password reset, and sends transactional emails via Nodemailer.

## Prerequisites
- Node.js and npm
- MongoDB connection string (Atlas is fine)
- SMTP account (configure host/port/user/pass in `.env`)

## Setup
1. cd backend
2. Create a `.env` with:
   - PORT (optional, defaults to 4000)
   - MONGODB_URI
   - JWT_SECRET
   - NODE_ENV (use production to enable secure cookies)
   - SMTP_HOST (e.g., smtp.gmail.com or Brevo host)
   - SMTP_PORT (465 for SSL, 587 for STARTTLS)
   - SMTP_USER
   - SMTP_PASS
   - SENDER_EMAIL
3. npm install

## Run
- npm start to launch the API.
- npm run server for autoreload with nodemon.

## Project structure
- server.js: Express app, JSON/cookie parsing, CORS allowlist (http://localhost:5173), mounts routers, starts server.
- config/mongodb.js: Mongoose connection helper.
- config/nodemailer.js: SMTP transporter (host/port/user/pass from env; secure set by port).
- models/userModels.js: User schema with password, verification OTP, reset OTP fields.
- middleware/userAuth.js: Reads JWT from token cookie and attaches userId.
- controllers/: authController.js (register, login, logout, send/verify account OTP, send reset OTP, reset password, auth check); userController.js (fetch profile data).
- routes/: authRoutes.js under /api/auth, userRoutes.js under /api/user.

## API overview
- POST /api/auth/register {name,email,password} ? create user, set JWT cookie, send welcome email.
- POST /api/auth/login {email,password} ? set JWT cookie.
- POST /api/auth/logout ? clear JWT cookie.
- POST /api/auth/send-verify-otp (auth cookie) ? email verification OTP.
- POST /api/auth/verify-account (auth cookie) {otp} ? verify account.
- GET /api/auth/is-auth (auth cookie) ? simple auth check.
- POST /api/auth/send-reset-otp {email} ? email reset OTP.
- POST /api/auth/reset-password {email,otp,newPass} ? update password.
- GET /api/user/data (auth cookie) ? return user name and verification status.

Cookies: JWT stored as token, httpOnly; secure/sameSite toggled by NODE_ENV.
