FROM node:lts
ENV NODE_VERSION 22.2.0
WORKDIR /server
COPY . .
RUN echo migration_name | npx prisma migrate dev
RUN COPY .env.example .env
RUN npm ci
CMD [ "npm", "run", "dev" ]
