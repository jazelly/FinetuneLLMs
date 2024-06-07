process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
import cors from "cors";
import { reqBody } from "./src/utils/http";
import { systemEndpoints } from "./src/endpoints/system";
import { workspaceEndpoints } from "./src/endpoints/workspaces";
import { chatEndpoints } from "./src/endpoints/chat";
import { embeddedEndpoints } from "./src/endpoints/embed";
import { embedManagementEndpoints } from "./src/endpoints/embedManagement";
import { getVectorDbClass } from "./src/utils/helpers";
import { adminEndpoints } from "./src/endpoints/admin";
import { inviteEndpoints } from "./src/endpoints/invite";
import { utilEndpoints } from "./src/endpoints/utils";
import { developerEndpoints } from "./src/endpoints/api";
import { extensionEndpoints } from "./src/endpoints/extensions";
import { bootHTTP, bootSSL } from "./src/utils/boot";
import { workspaceThreadEndpoints } from "./src/endpoints/workspaceThreads";
import { documentEndpoints } from "./src/endpoints/document";
import { jobEndpoints } from "./src/endpoints/job";
import { agentWebsocket } from "./src/endpoints/agentWebsocket";
const app = express();
const apiRouter = express.Router();
const FILE_LIMIT = "3GB";

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
extensionEndpoints(apiRouter);
workspaceEndpoints(apiRouter);
workspaceThreadEndpoints(apiRouter);
chatEndpoints(apiRouter);
adminEndpoints(apiRouter);
inviteEndpoints(apiRouter);
embedManagementEndpoints(apiRouter);
utilEndpoints(apiRouter);
documentEndpoints(apiRouter);
agentWebsocket(apiRouter);
developerEndpoints(app, apiRouter);
jobEndpoints(apiRouter);

// Externally facing embedder endpoints
embeddedEndpoints(apiRouter);

if (process.env.NODE_ENV !== "development") {
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
} else {
  // Debug route for development connections to vectorDBs
  apiRouter.post("/v/:command", async (request, response) => {
    try {
      const VectorDb = getVectorDbClass();
      const { command } = request.params;
      if (!Object.getOwnPropertyNames(VectorDb).includes(command)) {
        response.status(500).json({
          message: "invalid interface command",
          commands: Object.getOwnPropertyNames(VectorDb),
        });
        return;
      }

      try {
        const body = reqBody(request);
        const resBody = await VectorDb[command](body);
        response.status(200).json({ ...resBody });
      } catch (e) {
        // console.error(e)
        console.error(JSON.stringify(e));
        response.status(500).json({ error: e.message });
      }
      return;
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });
}

app.all("*", function (_, response) {
  response.sendStatus(404);
});

if (!!process.env.ENABLE_HTTPS) {
  bootSSL(
    app,
    process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3001
  );
} else {
  bootHTTP(
    app,
    process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3001
  );
}
