FROM node:lts
ENV NODE_VERSION 22.2.0
WORKDIR /server
COPY package*.json ./
RUN npm ci
COPY . .
COPY .env.example .env
ENV port=3001
CMD [ "npm", "run", "start" ]
