# Gunakan image Node berbasis Debian (bukan Alpine)
FROM node:20

# Set working directory
WORKDIR /app

# Copy file package.json dan package-lock.json dari backend
COPY backend/package*.json ./backend/

# Install dependency sistem yang diperlukan canvas (Python + build tools)
RUN apt-get update && apt-get install -y python3 make g++ && \
    cd backend && npm install --legacy-peer-deps

# Copy seluruh backend ke dalam container
COPY backend ./backend

# Set workdir ke backend
WORKDIR /app/backend

# Expose port (ubah sesuai port aplikasi kamu)
EXPOSE 5000

# Jalankan aplikasi
CMD ["node", "src/index.js"]
