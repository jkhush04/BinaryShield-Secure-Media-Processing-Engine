# Use lightweight image
FROM node:18-alpine

# Install ffmpeg
RUN apk add --no-cache ffmpeg

# Set working directory
WORKDIR /app

# Copy only package files first (better caching)
COPY package*.json ./

# Install only production dependencies  then -> RUN npm ci--only=production , otherwise
RUN npm ci 


# Copy rest of the code
COPY . .

# Expose port
EXPOSE 5000

# Run as non-root user (basic security)
RUN addgroup -S app && adduser -S app -G app
USER app

# Start app
CMD ["node", "server.js"]