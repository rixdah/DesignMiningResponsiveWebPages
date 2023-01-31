FROM mcr.microsoft.com/playwright:v1.30.0-focal

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

ENV PATH /app/node_modules/.bin:$PATH

