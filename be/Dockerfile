FROM node:20

LABEL author="Mattia Gallinaro"
LABEL description="Portale Pazienti Backend"
LABEL version="1.0.0"

USER root

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]