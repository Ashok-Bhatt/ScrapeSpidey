FROM ghcr.io/puppeteer/puppeteer:24.32.0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
CMD [ "node", "src/index.js" ]