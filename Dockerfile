FROM node:18

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Remove existing bcrypt and reinstall inside Docker
RUN npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 4000

CMD ["node", "server.js"]
