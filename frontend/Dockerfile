FROM node:lts
ENV NODE_VERSION 22.2.0
WORKDIR /frontend
COPY . .
RUN npm ci
ENV CI=true
ENV PORT=3000
RUN npm run build
CMD [ "npm", "run", "dev" ]
