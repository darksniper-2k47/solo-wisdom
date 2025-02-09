# Use Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Set npm registry to use secure connection
RUN npm config set registry https://registry.npmjs.org/

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Expose the port
EXPOSE $PORT

# Start the app
CMD ["npm", "start"] 