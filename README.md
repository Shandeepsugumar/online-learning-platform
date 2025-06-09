# online-learning-platform
This project is a full-stack online learning platform built using Bootstrap for the frontend, Node.js with Express.js for the backend, and MongoDB for data storage. It is designed to provide an intuitive and user-friendly experience for both learners and administrators.
# Features
 # For Learners:
  > Register and log in securely
  > Browse and enroll in available courses
  > View course content and materials
  > Track learning progress
  > Responsive user interface for seamless experience on all devices

 # For Admins:
  > Admin authentication and dashboard
  > Add, update, and delete courses
  > Manage user data and course enrollments

# Tech Stack:
  1) Frontend: HTML, CSS, JavaScript, Bootstrap
  2) Backend: Node.js, Express.js
  3) Database: MongoDB (using Mongoose)
  4) Authentication: JWT-based login system
  5) Deployment: Configured for CI/CD using DevOps tools (Docker, Jenkins, Kubernetes)

# DevOps Integration:
This project supports automated deployment with:
  > Docker: Containerization of the application
  > Jenkins: Automated build and test pipeline
  > Kubernetes: Scalable deployment environment

# Folder Structure:
├── client/               # Frontend code
├── server/               # Backend code (Express APIs)
├── models/               # Mongoose schemas
├── routes/               # API route handlers
├── public/               # Static files
├── Dockerfile            # Docker build configuration
├── Jenkinsfile           # Jenkins pipeline script

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







