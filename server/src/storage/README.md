# FinetuneLLMs Storage

This folder is for the local or disk storage of ready-to-embed documents, vector-cached embeddings, and the disk-storage of LanceDB and the local SQLite database.

This folder should contain the following folders.
`documents`
`lancedb` (if using lancedb)
`vector-cache`
and a file named exactly `finetunellms.db`

### Common issues

**SQLITE_FILE_CANNOT_BE_OPENED** in the server log = The DB file does not exist probably because the node instance does not have the correct permissions to write a file to the disk. To solve this..

- Local dev

  - Create a `finetunellms.db` empty file in this directory. Thats all. No need to reboot the server or anything. If your permissions are correct this should not ever occur since the server will create the file if it does not exist automatically.
