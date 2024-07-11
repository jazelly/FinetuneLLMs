const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
import cors from "cors";
import { reqBody } from "./src/utils/http";
import { systemEndpoints } from "./src/endpoints/system";
import { chatEndpoints } from "./src/endpoints/chat";
import { adminEndpoints } from "./src/endpoints/admin";
import { utilEndpoints } from "./src/endpoints/utils";
import { bootHTTP, bootSSL } from "./src/utils/boot";
import { documentEndpoints } from "./src/endpoints/document";
import { jobEndpoints } from "./src/endpoints/job";
import { config } from "./src/utils/dotenv";

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
systemEndpoints(apiRouter);
chatEndpoints(apiRouter);
adminEndpoints(apiRouter);
utilEndpoints(apiRouter);
documentEndpoints(apiRouter);
jobEndpoints(apiRouter);

app.use(
  express.static(path.resolve(__dirname, "public"), {
    extensions: ["js"],
    setHeaders: (res) => {
      // Disable I-framing of entire site UI
      res.removeHeader("X-Powered-By");
      res.setHeader("X-Frame-Options", "DENY");
    },
  })
);

app.use("/", function (_, response) {
  response.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/robots.txt", function (_, response) {
  response.type("text/plain");
  response.send("User-agent: *\nDisallow: /").end();
});

app.all("*", function (_, response) {
  response.sendStatus(404);
});

if (!!config.ENABLE_HTTPS) {
  bootSSL(app, config.SERVER_PORT ?? 3001);
} else {
  bootHTTP(app, config.SERVER_PORT ?? 3001);
}
