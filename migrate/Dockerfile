# Use Node.js 18 as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application files
COPY . .

# Install packages
RUN npm install

# Generate Prisma client
RUN npx prisma generate

ARG POSTGRES_DATABASE_URL_PROD
ENV POSTGRES_DATABASE_URL=${POSTGRES_DATABASE_URL_PROD}

# Expose the port the app runs on
EXPOSE 3030

# Run database migration before starting the server
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed"]
