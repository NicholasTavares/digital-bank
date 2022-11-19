FROM node:18
WORKDIR /usr/ngcash

COPY ./package.json .
RUN yarn
COPY ./tsconfig.json .
COPY ./nest-cli.json .