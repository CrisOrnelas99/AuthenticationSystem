# Authentication System Frontend

React + Vite client for the authentication service (register/login, email verification OTP, password reset) using http-only cookies set by the backend.

## Getting started
1. cd frontend
2. npm install
3. Set environment in `.env`:
   - VITE_BACKEND_URL: base URL of the backend (default http://localhost:4000).
4. npm run dev and open the printed URL.

## What it does
- Registration and login forms that send credentials to the backend and rely on JWT cookies.
- Email verification flow: request OTP, submit OTP, reflects verification status.
- Password reset flow: request reset OTP, submit new password with OTP.
- Uses fetch with credentials: "include" so auth cookies are sent with requests.

## Notes
- CORS is allowed from http://localhost:5173 by default; update the backend if the frontend runs elsewhere.
- The app expects the backend to be running before API calls succeed.
