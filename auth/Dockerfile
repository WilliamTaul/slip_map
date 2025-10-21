FROM node:24-alpine

WORKDIR /auth
COPY ./package.json ./

RUN npm i

COPY ./ .

EXPOSE 3001

CMD ["npm", "run", "devStartAuth"]