# Use Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Update npm and configure registry
RUN npm install -g npm@latest && \
    npm config set registry https://registry.npmjs.org/ && \
    npm config set strict-ssl false

# Install dependencies with legacy peer deps flag
RUN npm install --legacy-peer-deps

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Expose the port
EXPOSE $PORT

# Start the app
CMD ["npm", "start"]