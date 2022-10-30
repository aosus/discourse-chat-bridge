FROM node:lts-alpine as builder

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci --only=production --omit=dev

FROM node:lts-alpine as app
WORKDIR /app

USER node

COPY --from=builder --chown=node:node . .
COPY --chown=node:node . .

# Bundle app source
COPY . .

ENV NODE_ENV production

ENV NEXT_TELEMETRY_DISABLED 1

CMD [ "node", "index.js" ]