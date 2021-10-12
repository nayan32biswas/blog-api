FROM node:16

RUN mkdir -p /server/
WORKDIR /server/

COPY ./package*.json ./
COPY ./yarn.lock ./
RUN yarn install

COPY ./ /server/