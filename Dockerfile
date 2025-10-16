# Gunakan image Node berbasis Debian
FROM node:20

# Set working directory
WORKDIR /app

# Copy file package.json
COPY backend/package*.json ./ 

# Install dependency sistem untuk canvas
RUN apt-get update && apt-get install -y python3 make g++ && \
    npm install --legacy-peer-deps

# Copy seluruh kode backend
COPY backend .

# Expose port
EXPOSE 5000

# Jalankan aplikasi
CMD ["node", "src/index.js"]
