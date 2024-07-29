FROM node:lts
ARG ARG_UID=1001
ARG ARG_GID=1001

RUN groupadd -g "$ARG_GID" vertile-server && \
    useradd -m -g "$ARG_GID" -s /bin/bash vertile-server
RUN mkdir -p /server && chown -R vertile-server:vertile-server /server

ENV NODE_VERSION 22.2.0
USER root
WORKDIR /server

ENV DATABASE_URL=postgres://postgres:mysecretpassword@database:5432/main
COPY . .
RUN npm ci
# COPY init_env.sh /server/init_env.sh
# RUN chmod +x /server/init_env.sh
# RUN /server/init_env.sh
RUN chmod +x ./docker-init.sh
ENV NODE_ENV=production

RUN npm install --g typescript
RUN npx tsc -p ./tsconfig.json

EXPOSE 3001
ENTRYPOINT ["/bin/bash", "/server/docker-init.sh"]