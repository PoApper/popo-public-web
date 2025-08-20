# Build Step
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --ignore-scripts --legacy-peer-deps

COPY . .

# dev, prod
ARG NEXT_PUBLIC_ENV
ENV NEXT_PUBLIC_ENV=${NEXT_PUBLIC_ENV}

# popo version
ARG POPO_VERSION
ENV NEXT_PUBLIC_POPO_VERSION=${POPO_VERSION}

RUN npm run build

# Run Step
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Copy standalone output (includes all necessary dependencies)
COPY --from=builder /usr/src/app/.next/standalone ./
COPY --from=builder /usr/src/app/.next/static ./.next/static
COPY --from=builder /usr/src/app/public ./public

# Set port environment variable for standalone server
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["node", "server.js"]
