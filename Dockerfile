# ---------- CI / Build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN npm run lint
RUN npm run compile
RUN npm test


# ---------- Runtime stage ----------
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/src/docs ./src/docs
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

CMD ["node", "dist/main.js"]