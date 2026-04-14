FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package.json ./
RUN npm install --omit=dev

FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache wget
COPY --from=deps /app/node_modules ./node_modules
COPY package.json server.js ./
COPY index.html ./
COPY js/ ./js/
COPY css/ ./css/
COPY assets/ ./assets/

EXPOSE 3003
CMD ["node", "server.js"]
