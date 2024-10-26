FROM node:22.10-alpine3.20 AS base

# All deps stage
FROM base AS deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN node ace build

# Production stage
FROM base
ENV NODE_ENV=development
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
EXPOSE 3333
CMD ["npm", "start"]
