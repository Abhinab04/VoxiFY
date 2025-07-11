FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./

# Install packages
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port Vite uses
EXPOSE 5173

# Run Vite dev server on all network interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
