FROM node:18

COPY * /app/

WORKDIR /app

RUN npm install && npm cache clean --force

CMD node index.js