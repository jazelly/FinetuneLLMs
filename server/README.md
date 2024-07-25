# Server

This is the node.js server for handling HTTP requests. Usually, this is used to persist and fetch all kinds of info from database.

## Setup .env

Copy `.env.example` to `.env`

## Setup Database

We use prisma to manage the DB rollout. It's as simple as running

```
npx prisma migrate dev
```

Everything it migrates is in `prisma/schema.prisma`. From there, you can switch database provider to others.
However, we recommend databases that can accept TCP connections, as there are other modules interacting with it.

### Switch to other database

In case you want to use other database providers, you can achieve this by modifying `prisma/schema.prisma`.
Once it's done, you need to delete `prisma/migrations` and run `npx prisma migrate dev`. You will also need to
update `DATABASE_URL` in `.env` with correct URL.

## Install dependencies

If you have `nvm`, it's a good idea to run `nvm use` first.

Then simply run

```
npm ci
```

## Start with https

1. Generate certificates

   ```
   openssl req -nodes -new -x509 -keyout server.key -out server.cert
   ```

2. Add certificates path to .env file
