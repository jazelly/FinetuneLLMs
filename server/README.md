# Server

This is the node.js server for handling HTTP requests. Usually, this is used to persist and fetch all kinds of info from database.

## Setup Database

We use prisma to manage the DB rollout. It's as simple as running

```
npx prisma prisma dev
```

Everything it migrates is in `prisma/schema.prisma`. From there, you can switch database provider to others.
However, we recommend databases that can accept TCP connections, as there are other modules interacting with it.

### Start with https

1. Generate certificates

   ```
   openssl req -nodes -new -x509 -keyout server.key -out server.cert
   ```

2. Add certificates path to .env file
