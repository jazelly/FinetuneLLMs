FROM node:lts
USER root
WORKDIR /server

# this should be the databse url in your case
ENV DATABASE_URL=postgres://postgres:mysecretpassword@database:5432/main
ENV NODE_ENV=production
COPY . .
RUN npm ci
# COPY init_env.sh /server/init_env.sh
# RUN chmod +x /server/init_env.sh
# RUN /server/init_env.sh
RUN chmod +x ./docker-init.sh

RUN npm install --g typescript
RUN npx tsc -p ./tsconfig.json

ENTRYPOINT ["/bin/bash", "/server/docker-init.sh"]
EXPOSE 3001