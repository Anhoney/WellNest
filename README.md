WELLNEST: Elderly Care Health Management System

📌 Project Overview
WELLNEST is an Elderly Care Health Management System designed to streamline and enhance healthcare services for elderly individuals. It provides an efficient platform for healthcare professionals to manage appointments, virtual consultations, and patient records while ensuring seamless communication between caregivers and patients.

🚀 Features


🔹 Appointment Management
- Create, update, and delete physical appointments.
- View upcoming and past appointments.
- Approve or reject appointment requests.
- Notify users when appointments are approved or canceled.

🔹 Virtual Consultation
- Healthcare professionals can offer online consultations.
- Users can book virtual appointments based on availability.
- Meeting links and consultation notes are recorded.
- Payment processing for virtual consultations.

🔹 User & Profile Management
- Secure authentication & authorization system.
- Healthcare professionals and patients can manage their profiles.
- Profile images are stored and retrieved securely.

🔹 Notifications System
- Real-time notifications for appointment approvals, rejections, and updates.
- Users receive alerts for upcoming appointments.

🏗️ Tech Stack 


Backend: 
- Node.js with Express.js – API development.
- PostgreSQL – Database for storing appointments, user profiles, and consultations.

Frontend: (Not included in this repo, if applicable)
- React.js 

Other Technologies:
- JWT Authentication – Secure login system.
- AES - Encrypt sensitive data.

🛠️ Setup & Installation

1️⃣ Clone the Repository
- git clone https://github.com/your-username/wellnest.git
- cd wellnest

2️⃣ Install Dependencies
- npm install

3️⃣ Setup Environment Variables
-Create a .env file in the root directory and add the following:
  - DATABASE_URL=your_postgresql_connection_string
  - JWT_SECRET=your_jwt_secret
  - PORT=5001

4️⃣ Run the Application
- npm start

Server runs on http://localhost:5001/ by default.

🔐 Authentication

JWT-based authentication is used for securing endpoints.
Add Authorization: Bearer <your_token> in API requests.

📌 Future Enhancements

AI-powered health insights for elderly patients.
Integration with wearable health devices for real-time monitoring.
Telemedicine features for video consultations.

💙 Made with care for elderly well-being.
