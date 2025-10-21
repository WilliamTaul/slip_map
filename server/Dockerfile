FROM node:24-alpine

WORKDIR /server
COPY ./package.json ./

RUN npm i

COPY ./ .

EXPOSE 3000

CMD ["npm", "run", "devStart"]