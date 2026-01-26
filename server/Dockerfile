# 1️⃣ Fix Node version
FROM node:20

# 2️⃣ Container ke andar folder
WORKDIR /app

# 3️⃣ Dependency files copy
COPY package*.json ./

# 4️⃣ Dependencies install (ioredis yahin install hota hai)
RUN npm install

# 5️⃣ Backend code copy
COPY . .

# 6️⃣ Port expose
EXPOSE 5000

# 7️⃣ App start
CMD ["npm", "start"]