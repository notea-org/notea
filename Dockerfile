
FROM node:lts-alpine AS pkg

WORKDIR /opt/app
COPY package.json yarn.lock ./
COPY packages packages
RUN find packages \! -name "package.json" -mindepth 2 -maxdepth 2 -print | xargs rm -rf

# Install dependencies only when needed
FROM node:lts-alpine AS deps

WORKDIR /opt/app
COPY --from=pkg /opt/app .
RUN yarn install --frozen-lockfile 

# Rebuild the source code only when needed
# This is where because may be the case that you would try
# to build the app based on some `X_TAG` in my case (Git commit hash)
# but the code hasn't changed.
FROM node:lts-alpine AS builder

ENV NODE_ENV=production
WORKDIR /opt/app
COPY . .
COPY --from=deps /opt/app/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM node:lts-alpine AS runner

ARG X_TAG
WORKDIR /opt/app
ENV NODE_ENV=production
COPY --from=builder /opt/app/next.config.js ./
COPY --from=builder /opt/app/.next ./.next
COPY --from=builder /opt/app/node_modules ./node_modules
CMD ["node_modules/.bin/next", "start"]
