FROM node:lts AS development
WORKDIR frontend
COPY package.json /frontend/package.json
COPY package-lock.json /frontend/package-lock.json
RUN npm ci
COPY . ./
ENV CI=true
ENV PORT=3000
FROM development AS build
RUN npm install
RUN npm run build
