# Gunakan image Node berbasis Debian
FROM node:20

# Set working directory
WORKDIR /app

# Copy file package.json dan package-lock.json dari backend
COPY backend/package*.json ./ 

# Install dependency sistem yang diperlukan canvas (Python + build tools)
RUN apt-get update && apt-get install -y python3 make g++ && \
    npm install --legacy-peer-deps

# Copy seluruh backend ke dalam container
COPY backend ./

# Expose port (ubah sesuai port aplikasi kamu)
EXPOSE 5000

# Jalankan aplikasi
CMD ["node", "src/index.js"]
