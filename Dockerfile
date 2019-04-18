FROM node:10.13-alpine
LABEL Author Russell Ratcliffe <russell@deephire.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN yarn

# Remove dev dependencies

EXPOSE 3000

CMD [ "yarn", "start"]
