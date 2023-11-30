FROM node:latest as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build



FROM nginx:alpine

# Copy the build output from the first stage into the Nginx directory
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html

# ssl cert
COPY private/certificate.crt /etc/nginx/ssl/certificate.crt
COPY private/private.key /etc/nginx/ssl/private.key

# Expose port 80 to the outside once the container has launched
EXPOSE 80

LABEL name="frontend"

# The default command runs Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
