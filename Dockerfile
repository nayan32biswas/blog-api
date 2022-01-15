FROM node:16

RUN yarn global add pm2

RUN mkdir -p /app/server/
WORKDIR /app/server/

COPY ./package*.json ./
COPY ./yarn.lock ./
RUN yarn install

COPY ./ /app/server/
