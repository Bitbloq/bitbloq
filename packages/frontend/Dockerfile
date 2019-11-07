FROM node:12.13.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app/

COPY . ./

ENV NODE_ENV=production

RUN yarn install

WORKDIR /usr/src/app/packages/frontend
RUN yarn run build

EXPOSE 80

RUN chmod +x /usr/src/app/packages/frontend/docker-entrypoint.sh
ENTRYPOINT ["/usr/src/app/packages/frontend/docker-entrypoint.sh"]
