FROM node:18-alpine AS builder

WORKDIR /app



# TODO: build process should be in CI/CD not here.
COPY ./package*.json .
RUN npm install --save



COPY ./src /app/src
COPY ./public /app/public

# Copy the rest of the application code to the container
COPY . .

RUN npm run build

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html


# Copy the custom Nginx configuration file
COPY default.conf /etc/nginx/conf.d/default.conf
