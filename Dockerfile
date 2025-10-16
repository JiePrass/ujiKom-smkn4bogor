# Gunakan image Node.js resmi
FROM node:20

# Set working directory ke /app/backend
WORKDIR /app/backend

# Copy file package.json dan lock file
COPY backend/package*.json ./

# Install dependency sistem dan package Node.js
RUN apt-get update && apt-get install -y python3 make g++ && \
    npm install --legacy-peer-deps

# Copy seluruh isi folder backend ke dalam container
COPY backend/ .

# Expose port aplikasi
EXPOSE 5000

# Jalankan aplikasi
CMD ["node", "src/index.js"]
