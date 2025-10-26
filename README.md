#College Appointment System API Documentation
College Appointment System API , which allows students and professors to manage appointments efficiently. Whether you're a student trying to book an appointment with a professor, or a professor managing your availability, this system has you covered.

Base URL
http://localhost:3000

Endpoints
1. User Authentication
Signup
POST /auth/signup

Request Body:

{
  "email": "user@example.com",
  "password": "password123",
  "role": "professor" // or "student"
}
Response:

{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "professor"
  }
}
Login
POST /auth/login

Request Body:

{
  "email": "user@example.com",
  "password": "password123"
}
Response:

{
  "message": "Login successful",
  "token": "JWT-TOKEN",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "professor"
  }
}
2. Professor Availability
Add Availability
POST /availability

Headers:

{
  "Authorization": "Bearer <JWT-TOKEN>"
}
Request Body:

{
  "time": "10:00 AM"
}
Response:

{
  "message": "Availability added successfully",
  "availability": {
    "id": 1,
    "time": "10:00 AM"
  }
}
Get Availability
GET /availability/:professorId

Headers:

{
  "Authorization": "Bearer <JWT-TOKEN>"
}
Response:

{
  "availability": [
    {
      "id": 1,
      "time": "10:00 AM"
    },
    {
      "id": 2,
      "time": "11:00 AM"
    }
  ]
}
3. Appointments
Book Appointment
POST /appointments

Headers:

{
  "Authorization": "Bearer <JWT-TOKEN>"
}
Request Body:

{
  "professorId": 1,
  "time": "10:00 AM"
}
Response:

{
  "message": "Appointment booked successfully",
  "appointment": {
    "id": 1,
    "studentId": 2,
    "professorId": 1,
    "time": "10:00 AM",
    "status": "pending"
  }
}
Get Student's Appointments
GET /appointments/student

Headers:

{
  "Authorization": "Bearer <JWT-TOKEN>"
}
Response:

{
  "appointments": [
    {
      "id": 1,
      "professorId": 1,
      "time": "10:00 AM",
      "status": "pending"
    }
  ]
}
Get Professor's Appointments
GET /appointments/professor

Headers:

{
  "Authorization": "Bearer <JWT-TOKEN>"
}
Response:

{
  "appointments": [
    {
      "id": 1,
      "studentId": 2,
      "time": "10:00 AM",
      "status": "pending"
    }
  ]
}
Cancel Appointment
DELETE /appointments/:appointmentId

Headers:

{
  "Authorization": "Bearer <JWT-TOKEN>"
}
Response:

{
  "message": "Appointment canceled successfully"
}
Appointment Status Management
PATCH /appointments/:appointmentId/status

Headers:

{
  "Authorization": "Bearer <JWT-TOKEN>"
}
Request Body:

{
  "status": "confirmed" // or "completed", "pending", "canceled"
}
Response:

{
  "message": "Appointment status updated successfully",
  "appointment": {
    "id": 1,
    "status": "confirmed"
  }
}
Postman Testing Workflow
Signup Users

Use /auth/signup to create both Professor and Student accounts.
Login Users

Use /auth/login to retrieve tokens for both Professor and Student.
Add Professor Availability

Use /availability to add availability for the professor. Make sure to include the Professor's JWT token.
View Professor Availability

Use /availability/:professorId to fetch availability for the professor. Include the Student's JWT token.
Book Appointment

Use /appointments to book an appointment as a student. Provide the Professor's ID and the desired time.
Check Appointments

For Students: Use /appointments/student to view the student’s appointments.
For Professors: Use /appointments/professor to view the professor’s appointments.
Cancel Appointment

Use /appointments/:appointmentId to cancel an appointment as a professor.
Update Appointment Status

For Professors: Use /appointments/:appointmentId/status to mark an appointment as "confirmed."
For Students: Use /appointments/:appointmentId/status to mark the appointment as "completed" after attending.
Explanation of Appointment Statuses
Pending: The appointment has been booked but is waiting for confirmation by the professor.
Confirmed: The professor has confirmed the appointment.
Completed: The student has attended the appointment and marks it as completed.
Canceled: The appointment has been canceled (either by the student or the professor).
recent updates:

This is the updated API documentation, which now includes the Appointment Status Management feature. The professors can confirm appointments, and students can mark appointments as completed. You can also manage the status with a PATCH request.
