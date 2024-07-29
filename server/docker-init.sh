#!/bin/bash

# Copy .env.example to .env
cp .env.example .env

# Replace all occurrences of ${HOST_ADDRESS} with 'host.docker.internal'
sed -i 's/\${HOST_ADDRESS}/host.docker.internal/g' .env

{
  npx prisma generate --schema=./prisma/schema.prisma &&
  npx prisma migrate deploy --schema=./prisma/schema.prisma &&
  node /server/dist/index.js
}  & wait -n

exit$?
