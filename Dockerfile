# Stage 1 - Build the Vite app
FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2 - Run the app with a static file server
FROM nginx:alpine

# Copy built app from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
