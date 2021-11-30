FROM node:lts AS development

COPY . /code

WORKDIR /code

RUN npm ci

CMD ["npm", "run", "start:dev"]

FROM development AS builder

RUN ["npm", "run", "build:prod"]

FROM node:lts AS production

COPY --from=development /code/lib /var/opt/matrix-bot
COPY --from=development /code/node_modules /node_modules
COPY config/production.yaml /var/opt/matrix-bot/config/development.yaml

WORKDIR /var/opt/matrix-bot

ENTRYPOINT ["node", "./index.js"]
