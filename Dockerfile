# Multi-stage Dockerfile for Healthcare Management System

# Stage 1: Build React Frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend

# Copy frontend package files
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy frontend source
COPY . .

# Build frontend
RUN npm run build

# Stage 2: Backend
FROM node:18-alpine AS backend
WORKDIR /app

# Copy backend package files
COPY server/package*.json ./
RUN npm install --production

# Copy backend source
COPY server/ ./

# Copy built frontend from previous stage
COPY --from=frontend-build /app/frontend/build ./public

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); });"

# Start server
CMD ["node", "index.js"]
