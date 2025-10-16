# Gunakan image Node berbasis Debian
FROM node:20

# Set working directory ke folder backend
WORKDIR /app/backend

# Copy file package.json dan package-lock.json
COPY backend/package*.json ./

# Install dependency sistem untuk canvas
RUN apt-get update && apt-get install -y python3 make g++ && \
    npm install --legacy-peer-deps

# Copy seluruh backend ke dalam container
COPY backend .

# Expose port aplikasi
EXPOSE 5000

# Jalankan aplikasi
CMD ["node", "src/index.js"]
