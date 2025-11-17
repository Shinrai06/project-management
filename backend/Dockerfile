FROM node:20-alpine AS base

# Install production dependencies separately so we can reuse layer between build/run.
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM deps AS builder
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
# Install only production deps for a smaller runtime image.
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]

