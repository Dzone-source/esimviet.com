# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY tsconfig.json ./
COPY src ./src/

RUN npx prisma generate
RUN npm run build

# ── Production stage ─────────────────────────────────────────────────────────
FROM node:20-slim AS runner

WORKDIR /app

RUN apt-get update \
  && apt-get install -y openssl \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd -g 1001 nodejs \
  && useradd -u 1001 -g nodejs -m appuser

ENV NODE_ENV=production
ENV PORT=4000

COPY package*.json ./
COPY prisma ./prisma/

# Production deps + Prisma CLI + seed tooling
RUN npm ci --omit=dev \
  && npm install prisma@5.22.0 ts-node@10.9.2 typescript@5.6.3 --no-save

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh \
  && mkdir -p uploads/qrcodes uploads/covers logs \
  && chown -R appuser:nodejs /app

USER appuser

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:4000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]
