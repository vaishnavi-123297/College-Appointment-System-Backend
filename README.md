# College Appointment API

## Setup
1. Copy `.env.example` to `.env` and set values.
2. Install dependencies:
3. Start dev server:
4. Run tests:

## Notes
- Tests use an in-memory MongoDB so you don't need a local database for tests.
- Endpoints:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/professors/:profId/slots
- GET /api/professors/:profId/slots
- POST /api/appointments
- GET /api/appointments/me
- DELETE /api/appointments/:apptId
5.npm test

Run server (manual Postman demo)

If you want to demo manually via Postman you need a running MongoDB or use an online MongoDB URI:

Copy .env.example → .env, update MONGO to your running Mongo URI and set JWT_SECRET.

Start server:
npm run dev
Server will listen on http://localhost:4000 (or the PORT you set).

6) Postman quick sequence (summary of requests to test flow)

POST /api/auth/register — create professor (role: professor)

POST /api/auth/login — login professor → copy token

POST /api/professors/:profId/slots — create slots (Auth header: Bearer <token>)

POST /api/auth/register — create student A1

POST /api/auth/login — login student A1 → copy token

GET /api/professors/:profId/slots — list available slots (Auth: student token)

POST /api/appointments — body { "slotId": "<id>" } (Auth: student token)

Repeat for student A2

DELETE /api/appointments/:apptId — professor cancels (Auth: professor token)

GET /api/appointments/me — student checks appointments (Auth: student A1 token)

7) Troubleshooting tips

If npm test times out: increase jest.setTimeout() value in test.

If you see duplicate-key E11000 errors while testing manually with local Mongo: either drop the DB or register with a different email.

If server fails to connect: check MONGO in .env and ensure MongoDB is running or use a cloud MongoDB (Atlas).

If Authorization fails: ensure header format is exactly Authorization: Bearer <token>.