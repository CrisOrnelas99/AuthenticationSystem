# Authentication System Frontend

React + Vite client for the authentication service (register/login, email verification OTP, password reset) using http-only cookies set by the backend.

## Getting started
1. cd frontend
2. npm install
3. Set environment in `.env`:
   - VITE_BACKEND_URL: base URL of the backend (default http://localhost:4000).
4. npm run dev and open the printed URL.

## What it does
- Registration and login forms that send credentials to the backend and rely on JWT cookies (Get Started opens Sign Up).
- Email verification flow: trigger from navbar, submit OTP on `/email-verify`, reflects verification status.
- Password reset flow: request reset OTP, submit OTP, set new password; redirects to Login after success and can lock to current user email when launched from navbar.
- Uses axios with `withCredentials` so auth cookies are sent with requests.

## Notes
- CORS is allowed from http://localhost:5173 by default; update the backend if the frontend runs elsewhere.
- The app expects the backend to be running before API calls succeed.
