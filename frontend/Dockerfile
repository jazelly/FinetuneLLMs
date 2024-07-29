FROM node:lts AS builder

WORKDIR /frontend
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .
RUN chmod +x /frontend/init_env.sh
RUN /frontend/init_env.sh

RUN npm run build

FROM nginx:alpine
COPY --from=builder /frontend/dist /usr/share/nginx/html

# Copy the build output from the host to the container

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 to the outside world
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]