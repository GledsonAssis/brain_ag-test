FROM node:18 AS builder
LABEL maintainer="Gledson Assis"
WORKDIR /app
COPY . .
RUN npm i && npm run build

FROM builder AS dependencies
RUN rm -r node_modules && npm install --only=production && cp -R node_modules prod_node_modules

FROM node:18 AS release
WORKDIR /root
COPY --from=dependencies /app/prod_node_modules ./node_modules
COPY --from=dependencies /app/build ./build
COPY --from=dependencies /app/package.json .
CMD npm run start
