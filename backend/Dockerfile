# Backend
###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

RUN apk add curl --no-cache

USER node

WORKDIR /app

COPY --chown=node:node package.json yarn.lock /app/

RUN yarn run ci

COPY --chown=node:node . /app

CMD yarn run start:dev

HEALTHCHECK --interval=10s --timeout=5s --retries=200 --start-period=10s CMD curl -f http://localhost:5001/api

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /app

COPY package.json yarn.lock /app/

COPY --chown=node:node --from=development /app/node_modules /app/node_modules

COPY --chown=node:node . /app

RUN yarn run build

ENV NODE_ENV production

RUN yarn install --prod --immutable --immutable-cache --check-cache

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

WORKDIR /app

RUN apk add curl --no-cache

COPY --chown=node:node --from=build /app/node_modules /app/node_modules
COPY --chown=node:node --from=build /app/dist /app/dist

HEALTHCHECK --interval=10s --timeout=5s --retries=200 --start-period=10s CMD curl -f http://localhost:5001/api

CMD node /app/dist/src/main.js