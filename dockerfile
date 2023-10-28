# Use the official Node.js runtime as a parent image
FROM node:20.6.1

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose the port your application runs on
EXPOSE 3000

# Define the command to start your application
CMD [ "npm", "start"]
