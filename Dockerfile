FROM node:20-alpine

RUN apk add --no-cache \
    python3 \
    py3-pip \
    build-base \
    pkgconf \
    cairo-dev \
    pango-dev \
    libjpeg-turbo-dev \
    giflib-dev \
    pixman-dev \
    fribidi-dev

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "server.js"]