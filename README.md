# Taulkie: Real-Time 🚀 Messaging App with Admin Panel 
## **React, Node.js, Express, Socket.IO – Full-stack messaging platform with role-based access**

| Home Screen | Chat Interface | Admin Panel |
|-------------|----------------|-------------|
| ![Home Screen](assets/screenshot1.png) | ![Chat Interface](assets/screenshot2.png) | ![Admin Panel](assets/screenshot3.png) |

### 🎥 Demo Video
- [Quick Overview](https://www.youtube.com/watch?v=2wwPwl1xS7w) - 3-minute walkthrough of the application

---

### 🐳 Run the Demo Locally with Docker Compose

#### **Prerequisites**
- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) installed  
- No other services running on ports **3000**, **3001**, **3002**, or **27018**  
  _(You can change these in `docker-compose.yml` if needed)_

#### **Setup Instructions**

1. **Clone the Repository**

2. **Rename** the provided '.env.example' file to '.env' in the project **root**
   - **Be careful** as there are several .env.examples provided, one for each individual service. *However* the only one necessary for docker-compose is the one in the **ROOT** directory!
   - The other .env.examples should only be used as templates if you wish to run the project locally without Docker.
    
4. **Ensure no other processes are using ports** `3000`, `3001`, `3002`, or `27018`.
   - If there are, you can adjust the port mappings inside your `docker-compose.yml`.
5. From the **project-root** run
   `docker compose up --build` or `docker-compose up --build` *The command will depend on which version of Docker you have*
6. Once the container starts use your browser and navigate to [http://localhost:3002](http://localhost:3002/)
7. Log in using one of the demo accounts:
   - Users: `john`, `emma`, `michael`, `olivia`, `david`, `sophia`
   - Password for all is `password`
8. Admin account:
   - Username: `admin`
   - Password: `password`
9. 🎉 Enjoy exploring the demo!

---

### ✨ Features
- **Real-time Messaging:** Instant updates on new messages
- **Role-based access:** Differentiates between user and admin roles with permissions
- **Secure Authentication:** JWT tokens are used for securely storing critical data and verifying users
- **Protected routes:** Custom middleware to restrict access based on role and ensuring no unauthorized access
- **Axios Interceptors:** Ensure smooth API calls with automatic retries and error handling
- **Persistent Chat History:** Messages are saved in MongoDB, ensuring no loss of data
- **Responsive UI:** Built with React and custom styled-components
- **Modular Architecture:** Separation of Authentication & Business Logic, following a modular architecture for easier scaling, maintenance, and reusability

---

### 🛠️ Tech Stack
- **Frontend:** React, Axios, Socket.IO-client
- **Backend:** Node.js, Express, Socket.IO
- **Database:** MongoDB
- **Authentication:** JWT

---

### 📝 Future Enhancements
- Push Notifications: Real-time Notifications for new messages and user activity
- User Profile Pictures: Add the ability for users to add profile pictures
- Message Search: Allow for searching through message boards for past messages
- Admin Dashboard: Add analytics to the dashboard

---
