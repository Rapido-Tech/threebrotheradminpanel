# Stage 1 - Build the Vite app
FROM node:20-alpine AS builder

# Accept build-time environment variable
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN echo "VITE_API_URL=$VITE_API_URL"

RUN npm run build

# Stage 2 - Run the app with a static file server
FROM nginx:alpine


# Copy built app from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
