FROM node:18-bullseye-slim AS test

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    tini \
    && rm -rf /var/lib/apt/lists/*

# set entrypoint to always run commands with tini
ENTRYPOINT [ "/usr/bin/tini", "--" ]

# change permissions to non-root user
RUN mkdir /app && chown -R node:node /app

WORKDIR /app

USER node

COPY --chown=user:node package.json yarn.lock tsconfig.json ./

RUN yarn install && yarn build && yarn cache clean

ADD . .

CMD [ "echo", "Running tests and building application..." ]

FROM node:18-bullseye-slim

# change permissions to non-root user
RUN mkdir /app && chown -R node:node /app

WORKDIR /app

USER node

COPY --chown=user:node package.json yarn.lock tsconfig.json ./

RUN yarn install --production && yarn cache clean

COPY --from=test --chown=node:node /app/dist ./dist

CMD [ "node", "dist/main" ]