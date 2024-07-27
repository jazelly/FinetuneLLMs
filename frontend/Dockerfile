FROM node:lts
ENV NODE_VERSION 22.2.0
WORKDIR /frontend
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV CI=true
RUN npm run build
CMD [ "npm", "run", "start" ]
