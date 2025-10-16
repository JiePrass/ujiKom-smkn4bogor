# Gunakan image Node
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy file package.json dan lock file
COPY backend/package*.json ./backend/

# Install dependencies (pakai legacy peer deps)
RUN cd backend && npm install --legacy-peer-deps

# Copy semua file backend ke container
COPY backend ./backend

# Set workdir ke backend
WORKDIR /app/backend

# Expose port (ubah sesuai port app kamu)
EXPOSE 5000

# Jalankan server
CMD ["node", "src/index.js"]
