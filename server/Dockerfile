FROM node:lts
ENV NODE_VERSION 22.2.0
WORKDIR /server
COPY package*.json ./
RUN npm ci
COPY . .
COPY .env.example .env
CMD [ "npm", "run", "dev" ]
