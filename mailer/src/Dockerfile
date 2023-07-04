FROM node:19.1.0
RUN npm install -g npm@8.19.3
RUN npm install -g yarn
RUN npm install -g @nestjs/cli
RUN mkdir -p /var/www/gateway
WORKDIR /var/www/gateway
ADD . /var/www/gateway
RUN yarn
CMD yarn build && yarn start:prod
