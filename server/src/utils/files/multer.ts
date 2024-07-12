import multer, { diskStorage } from "multer";
import { resolve, extname } from "path";
import { mkdirSync } from "fs";
import { v4 } from "uuid";

// Handle File uploads for auto-uploading.
const fileUploadStorage = diskStorage({
  destination: function (_, __, cb) {
    const uploadOutput =
      process.env.NODE_ENV === "development"
        ? resolve(__dirname, `../../../collector/hotdir`)
        : resolve(process.env.STORAGE_DIR!, `../../collector/hotdir`);
    cb(null, uploadOutput);
  },
  filename: function (_, file, cb) {
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    cb(null, file.originalname);
  },
});

// Asset storage for logos
const assetUploadStorage = diskStorage({
  destination: function (_, __, cb) {
    const uploadOutput =
      process.env.NODE_ENV === "development"
        ? resolve(__dirname, `../../storage/assets`)
        : resolve(process.env.STORAGE_DIR!, "assets");
    mkdirSync(uploadOutput, { recursive: true });
    return cb(null, uploadOutput);
  },
  filename: function (_, file, cb) {
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    cb(null, file.originalname);
  },
});

// Asset sub-storage manager for pfp icons.
const pfpUploadStorage = diskStorage({
  destination: function (_, __, cb) {
    const uploadOutput =
      process.env.NODE_ENV === "development"
        ? resolve(__dirname, `../../storage/assets/pfp`)
        : resolve(process.env.STORAGE_DIR!, "assets/pfp");
    mkdirSync(uploadOutput, { recursive: true });
    return cb(null, uploadOutput);
  },
  filename: function (req, file, cb) {
    const randomFileName = `${v4()}${extname(file.originalname)}`;
    req.randomFileName = randomFileName;
    cb(null, randomFileName);
  },
});

// Handle Generic file upload as documents
function handleFileUpload(request, response, next) {
  const upload = multer({ storage: fileUploadStorage }).single("file");
  upload(request, response, function (err) {
    if (err) {
      response
        .status(500)
        .json({
          success: false,
          error: `Invalid file upload. ${err.message}`,
        })
        .end();
      return;
    }
    next();
  });
}

export default {
  handleFileUpload,
};
