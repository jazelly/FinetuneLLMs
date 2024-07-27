FROM node:lts
ENV NODE_VERSION 22.2.0
WORKDIR /server
COPY package.json ./
RUN npm i
COPY . .
COPY .env.example .env
COPY init_env.sh /server/init_env.sh
RUN chmod +x /server/init_env.sh
RUN /server/init_env.sh
RUN npx prisma migrate dev
RUN npx prisma generate
ENV port=3001
CMD [ "npm", "run", "start" ]
