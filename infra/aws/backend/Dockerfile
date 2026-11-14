# Stage 1: Install the locked production dependencies
FROM node:22-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY server.js ./

# Stage 2: Production Environment
FROM node:22-alpine AS production
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/server.js ./
COPY --from=builder /usr/src/app/package*.json ./
USER node
EXPOSE 3000
CMD ["node", "server.js"]