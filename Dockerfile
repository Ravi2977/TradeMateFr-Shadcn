FROM node:18-alpine

# Set the working directory
WORKDIR /react-app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --silent

# Copy the rest of your application files
COPY . .

# Build the application for production
RUN npm run build

# Expose port 3000 (default for Vite)
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]

