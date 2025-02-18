FROM node:18 AS build

WORKDIR /app

COPY package*.json  ./
RUN npm install

COPY . .

# Use ARG to pass the environment variable
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}

RUN npm run build

# Use official Nginx image
FROM nginx:alpine

# Install necessary tools, including Nginx
RUN apk add --no-cache nginx bash curl gettext

# Ensure templates directory exists
RUN mkdir -p /etc/nginx/templates

# Copy Nginx config template
COPY ./nginx.conf /etc/nginx/templates/default.conf.template

# Copy frontend build files
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

# Substitute environment variables and start Nginx
CMD envsubst '$BACKEND_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && \
    nginx -g 'daemon off;'
