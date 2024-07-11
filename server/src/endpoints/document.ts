import { config } from "../utils/dotenv";

import { reqBody } from "../utils/http";
import {
  flexUserRoleValid,
  ROLES,
} from "../utils/middleware/multiUserProtected";
import { validatedRequest } from "../utils/middleware/validatedRequest";
import fs from "fs";
import fsAsync from "fs/promises";
import path from "path";
import { promisify } from "util";
import multer from "multer";
import { Datasets } from "../models/datasets";
import { HF_DATA_VALIDITY_URL, HF_DATA_API_BASE } from "./constants";
import { DatasetLocal } from "../models/schema/datasets.type";

const appendFile = promisify(fs.appendFile);
const unlinkFile = promisify(fs.unlink);

const serverRootDir = process.cwd();
const datasetsDirPath = path.join(serverRootDir, "storage/datasets");
const tempDirPath = path.join(serverRootDir, "storage/temp");

function getDatasetDestination(req, file, cb) {
  const fileName = file.originalname;
  const savePath = path.join(tempDirPath, fileName);
  cb(null, savePath);
}

const HF_DATASET_LINK_BASE = "https://huggingface.co/datasets/";

class DatasetStorage {
  getDestination;

  constructor(opts) {
    this.getDestination = opts.destination || getDatasetDestination;
  }

  _handleFile(req, file, cb) {
    this.getDestination(req, file, function (err, path) {
      if (err) return cb(err);

      const outStream = fs.createWriteStream(path);

      file.stream.pipe(outStream);
      outStream.on("error", cb);
      outStream.on("finish", function () {
        cb(null, {
          path: path,
          size: outStream.bytesWritten,
        });
      });
    });
  }
  _removeFile(req, file, cb) {
    fs.unlink(file.path, cb);
  }
}

const uploadMiddleware = multer({ storage: new DatasetStorage({}) });

function documentEndpoints(app) {
  if (!app) return;

  app.post(
    "/document/upload-by-chunk",
    [
      validatedRequest,
      flexUserRoleValid([ROLES.admin, ROLES.manager]),
      uploadMiddleware.single("file"),
    ],
    async (req, res) => {
      const { file } = req;
      const { chunkIndex, totalChunks } = req.body;
      const tempPath = file.path;
      const targetPath = path.join(datasetsDirPath, file.originalname);

      try {
        // Append the chunk to the target file
        await appendFile(targetPath, fs.readFileSync(tempPath));

        // remove the most recent chunk
        await unlinkFile(tempPath);

        if (Number(chunkIndex) === Number(totalChunks) - 1) {
          res.status(200).json({
            message: `all chunks completed for ${file.originalname}`,
          });
        } else {
          res.status(200).send({ mesage: `finished chunk ${chunkIndex}` });
        }
      } catch (error) {
        console.error("Error during file upload:", error);

        // Clean up: delete the partially uploaded file
        if (fs.existsSync(targetPath)) {
          await unlinkFile(targetPath);
        }

        // Respond with an error status
        res.status(500).send("Error during file upload");
      }
    }
  );

  const getDatasetName = (link) => {
    const segments = link.split("/");
    const datasetsIndex = segments.indexOf("datasets");
    return segments.slice(datasetsIndex + 1).join("/"); // e.g. ibm/duorc or rotten_tomatoes
  };

  app.post(
    "/document/save-from-hf",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (req, res) => {
      const { link } = reqBody(req);

      if (!link.startsWith(HF_DATASET_LINK_BASE))
        res.status(400).send({ message: "must be a HuggingFace link" });

      const name = getDatasetName(link);
      const datasetValidity = await fetch(
        `${HF_DATA_VALIDITY_URL}?dataset=${name}`,
        { method: "GET" }
      );
      const validityJson = await datasetValidity.json();

      if (
        !validityJson.preview &&
        !validityJson.search &&
        !validityJson.filter &&
        !validityJson.viewer
      ) {
        res.status(400).send({ message: "dataset not available" });
      }

      // split and config
      const splitsNConfigs = await fetch(
        `${HF_DATA_API_BASE}/splits?dataset=${name}`,
        {
          method: "GET",
        }
      );
      const splitsNConfigsJson = await splitsNConfigs.json();
      const splits = splitsNConfigsJson.splits;

      const configSplitSet = new Set();
      splits.forEach((item) => {
        const { config, split } = item;
        const configSplit = JSON.stringify({ config, split });
        configSplitSet.add(configSplit);
      });

      // get dataset meta data and save to space
      const info = await fetch(`${HF_DATA_API_BASE}/info?dataset=${name}`, {
        method: "GET",
      });

      const infoJson = await info.json();
      console.log("infoJson", infoJson);
      const datasetInfo = infoJson["dataset_info"];
      for (const configSplit of configSplitSet) {
        const configSplitJson = JSON.parse(configSplit as string);
        console.log("configSplit", configSplit);
        const configJson = datasetInfo[configSplitJson.config];
        if (configJson) {
          const splitJson = configJson["splits"][configSplitJson.split];
          const size = splitJson["num_bytes"];
          const numRows = splitJson["num_examples"];
          await Datasets.create({
            name,
            source: link,
            extension: "parquet",
            split: configSplitJson.split,
            config: configSplitJson.config,
            size,
            numRows,
          });
        }
      }

      res.status(200).send({
        configSplit: Array.from(configSplitSet),
        message: "dataset saved",
      });
    }
  );

  app.get(
    "/document/remote/all",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (req, res) => {
      const remoteDatasets = await Datasets.readBy({ path: null });
      res.json(remoteDatasets);
    }
  );

  app.get(
    "/document/local/all",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (req, res) => {
      // read from local dir
      const directoryPath = path.resolve(
        __dirname,
        `../../${config.DATABASE_PATH_FROM_ROOT}`
      );

      const localDatasets: DatasetLocal[] = [];
      try {
        const files = await fsAsync.readdir(directoryPath, {
          recursive: false,
        });

        for (const file of files) {
          const filePath = path.join(directoryPath, file);
          const stats = await fsAsync.stat(filePath);

          if (stats.isFile()) {
            const ext = path.extname(file).toLowerCase();
            const fileDetails = {
              name: path.basename(file, path.extname(file)), // File name without extension
              extension: ext, // File extension
              createdAt: stats.birthtime, // File creation date
              size: stats.size, // File size in bytes
            };

            if (ext === ".csv" || ext === ".txt" || ext == ".json")
              localDatasets.push(fileDetails);
          }
        }
      } catch (err: any) {
        console.error(`Error: ${err.message}`);
      }

      res.json(localDatasets);
    }
  );
}

export { documentEndpoints };
