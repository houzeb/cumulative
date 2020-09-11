FROM test-registry.zhonganinfo.com/env/node:8.15-alpine
COPY package.json /app/package.json
WORKDIR /app

ENV SASS_BINARY_SITE http://npm.zhonganonline.com/node-mirrors/node-sass/

RUN npm --registry http://npm.zhonganonline.com install

COPY ./ /app/

RUN npm run build:dll

RUN npm run build

EXPOSE 8080

CMD ["node", "server/base.js"]