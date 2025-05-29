# Use official Node.js image as base
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the app source code
COPY . .

# Expose the port your app listens on (5000 as per your server.js)
EXPOSE 5000

# Use environment variable for PORT (default to 5000)
ENV PORT=5000

# Start the application with node (or npm start if you prefer)
CMD ["node", "server.js"]
