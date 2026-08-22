# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copy nginx template — ${BACKEND_PORT} is substituted at container startup via envsubst
COPY nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 80
# nginx official image auto-runs envsubst on files in /etc/nginx/templates/
CMD ["nginx", "-g", "daemon off;"]

