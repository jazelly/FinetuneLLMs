FROM node:lts
ENV NODE_VERSION 22.2.0
WORKDIR /frontend
COPY package.json ./
COPY init_env.sh /frontend/init_env.sh
RUN chmod +x /frontend/init_env.sh
RUN /frontend/init_env.sh
RUN npm i
COPY . .
ENV CI=true
RUN npm run build
CMD [ "npm", "run", "start" ]
