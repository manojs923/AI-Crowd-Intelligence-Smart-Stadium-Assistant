# Stage 1: Build Environment
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Production Environment
FROM node:20-alpine AS production
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /usr/src/app/server.js ./
USER node
EXPOSE 3000
CMD ["node", "server.js"]