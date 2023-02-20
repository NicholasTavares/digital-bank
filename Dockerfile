FROM node:18-bullseye-slim

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

COPY --chown=user:node package.json yarn.lock ./

RUN yarn install --immutable --immutable-cache --check-cache && yarn cache clean --mirror

ADD . .

CMD [ "node", "dist/main" ]