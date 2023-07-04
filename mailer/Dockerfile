FROM node:19.1.0
RUN npm install -g npm
RUN npm install -g @nestjs/cli
RUN mkdir -p /var/www/gateway
WORKDIR /var/www/gateway
ADD . /var/www/gateway
RUN yarn
CMD yarn build && yarn start:prod
