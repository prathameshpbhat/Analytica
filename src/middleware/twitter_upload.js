const multer = require("multer");

const fileStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/*, video/*") {
    cb(null, true);
  }
  cb(null, false);
};

const upload = multer({
  storage: fileStorage,
  filter: fileFilter,
  limits: { fileSize: 5242880 },
}).single("file");

module.exports = upload;
