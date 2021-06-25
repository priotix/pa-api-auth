FROM keymetrics/pm2:14-alpine
LABEL mainteiner=priotix

RUN apk add --no-cache python build-base

COPY package.json package-lock.json /tmp/api-auth/

RUN cd /tmp/api-auth && npm install && npm rebuild bcrypt --build-from-source
RUN npm cache clean --force

RUN mkdir -p /var/www/api-auth && cp -a /tmp/api-auth/node_modules /var/www

WORKDIR /var/www/api-auth
ADD . /var/www/api-auth

CMD pm2-runtime start pm2.config.json --env ${NODE_ENV}

