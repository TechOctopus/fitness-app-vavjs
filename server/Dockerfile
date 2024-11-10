FROM node:23

WORKDIR /server

COPY ./package.json .

RUN npm install

COPY . .

EXPOSE 3333

CMD ["npm", "start"]
