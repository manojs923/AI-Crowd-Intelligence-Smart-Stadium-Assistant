# Stage 1: Build the React Application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Build the application
# We use ARG to pass Gemini API key if needed at build time, though environment variables are usually preferred at runtime.
# Since Vite bundles env vars starting with VITE_ at build time, it's safer to build with it.
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the custom Nginx configuration to support React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 8080 (Google Cloud Run expects port 8080 by default)
EXPOSE 8080

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
