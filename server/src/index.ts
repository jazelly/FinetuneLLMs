const express = require("express");
import https from "https";
import http from "http";
import fs from "fs";
import bodyParser from "body-parser";
import cors from "cors";
import { documentEndpoints } from "./endpoints/document";
import { jobEndpoints } from "./endpoints/job";
import { config } from "./utils/dotenv";

const app = express();
const apiRouter = express.Router();
const FILE_LIMIT = "10GB";

app.use(cors({ origin: true }));
app.use(bodyParser.text({ limit: FILE_LIMIT }));
app.use(bodyParser.json({ limit: FILE_LIMIT }));
app.use(
  bodyParser.urlencoded({
    limit: FILE_LIMIT,
    extended: true,
  })
);

require("express-ws")(app);
app.use("/api", apiRouter);
documentEndpoints(apiRouter);
jobEndpoints(apiRouter);

app.all("*", function (_, response) {
  response.sendStatus(404);
});

const port = config.SERVER_PORT ?? 3001;
if (!!config.ENABLE_HTTPS) {
  if (!config.HTTPS_CERT_PATH || !config.HTTPS_KEY_PATH) {
    throw Error("Missing HTTPS envs for certificates");
  }

  const options = {
    key: fs.readFileSync(config.HTTPS_KEY_PATH),
    cert: fs.readFileSync(config.HTTPS_CERT_PATH),
  };

  https
    .createServer(options, app)
    .listen(port, async () => {
      console.log(`Primary server in HTTPS mode listening on port ${port}`);
    })
    .on("error", catchSigTerms);
} else {
  http
    .createServer(app)
    .listen(port, () => {
      console.log(`HTTP Server running on port ${port}`);
    })
    .on("error", catchSigTerms);
}

function catchSigTerms() {
  process.once("SIGUSR2", function () {
    process.kill(process.pid, "SIGUSR2");
  });
  process.on("SIGINT", function () {
    process.kill(process.pid, "SIGINT");
  });
}
