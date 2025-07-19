FROM node:lts-alpine3.22 AS builder 
WORKDIR /app
COPY package*.json ./ 
RUN npm install 
COPY . .
RUN npm run build

FROM node:lts-alpine3.22 
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup 
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
RUN chown -R appuser:appgroup .
USER appuser

EXPOSE 3001 

CMD ["node", "dist/index.js"]