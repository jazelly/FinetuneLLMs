## Server

This is the node.js server for handling HTTP requests. Usually, this is used to persist and fetch all kinds of info from database.

### Start with https

1. Generate certificates

   ```
   openssl req -nodes -new -x509 -keyout server.key -out server.cert
   ```

2. Add certificates path to .env file
