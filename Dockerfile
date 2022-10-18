FROM node:16-alpine
COPY . /src
WORKDIR /src
RUN yarn && yarn build
