# 1️⃣ Use Alpine for better compatibility and smaller size
FROM node:20-alpine

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy dependency files
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy the rest of the code
COPY . .

# 6️⃣ Expose port
EXPOSE 5000

# 7️⃣ Start the application
CMD ["npm", "start"]