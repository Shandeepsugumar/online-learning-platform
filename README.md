# online-learning-platform
This project is a full-stack online learning platform built using Bootstrap for the frontend, Node.js with Express.js for the backend, and MongoDB for data storage. It is designed to provide an intuitive and user-friendly experience for both learners and administrators.

 # For Learners:
  1) Register and log in securely
  2) Browse and enroll in available courses
  3) View course content and materials
  4) Track learning progress
  5) Responsive user interface for seamless experience on all devices

 # For Admins:
  1) Admin authentication and dashboard
  2) Add, update, and delete courses
  3) Manage user data and course enrollments

# Tech Stack:
  1) Frontend: HTML, CSS, JavaScript, Bootstrap
  2) Backend: Node.js, Express.js
  3) Database: MongoDB (using Mongoose)
  4) Authentication: JWT-based login system
  5) Deployment: Configured for CI/CD using DevOps tools (Docker, Jenkins, Kubernetes)

# DevOps Integration:
This project supports automated deployment with:
  1) Docker: Containerization of the application
  2) Jenkins: Automated build and test pipeline
  3) Kubernetes: Scalable deployment environment

# Folder Structure:
1) ├── client/               # Frontend code
2) ├── server/               # Backend code (Express APIs)
3) ├── models/               # Mongoose schemas
4) ├── routes/               # API route handlers
5) ├── public/               # Static files
6) ├── Dockerfile            # Docker build configuration
7) ├── Jenkinsfile           # Jenkins pipeline script

# How to Run Locally:
  1) # Clone the repository:
     > git clone https://github.com/Shandeepsugumar/online-learning-platform.git
     > cd online-learning-platform
    
  2) # Install dependencies:
     > npm install

  3) # Start MongoDB server (locally or use MongoDB Atlas)
  4) # Run the server:
      > node server.js
  5) # Open your browser at http://localhost:3000

# License
This project is open-source and available under the MIT License.







