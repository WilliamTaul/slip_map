FROM node:24-alpine

WORKDIR /client
COPY ./package.json ./

RUN npm i

COPY ./ .

EXPOSE 3002

CMD ["npm", "run", "dev"]
