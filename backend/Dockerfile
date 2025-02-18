# Use Node.js 18 as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (to leverage Docker caching)
COPY package*.json /app

# Install dependencies before copying source code (for better caching)
RUN npm install


# Copy the rest of the application files
COPY . .


# Expose the port the app runs on
EXPOSE 3030


# Run the backend server
CMD [ "npm", "start" ]