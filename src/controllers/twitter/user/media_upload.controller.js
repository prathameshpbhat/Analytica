const axios = require("axios");
const fs = require("fs");
const oauth = require(`../../../libs/oauthv1`);
const path = require("path");
const multer = require("multer");

const fileStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/*") {
    cb(null, true);
  }
  cb(null, false);
};

const initialize = async (req, res) => {
  const rootPath = path.dirname(require.main.filename);

  const upload = multer({ storage: fileStorage, filter: fileFilter }).single(
    "file"
  );

  upload(req, res, function (err) {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      return res.send("Please select an image to upload");
    } else if (err instanceof multer.MulterError) {
      return res.send(err);
    } else if (err) {
      return res.send(err);
    }
    const file = req.file.buffer;
    console.log(file);
    const fileSize = req.file.size;

    var chunkSize = 1024 * 1024;
    var chunks = Math.ceil(fileSize / chunkSize, chunkSize);
    var chunk = 0;

    console.log("file size..", fileSize);
    console.log("chunks...", chunks);

    while (chunk <= chunks) {
      var offset = chunk * chunkSize;
      console.log("current chunk..", chunk);
      console.log("offset...", chunk * chunkSize);
      console.log("file blob from offset...", offset);
      console.log(file.slice(offset, offset + chunkSize));
      chunk++;
    }

    // const api_endpoint = `https://upload.twitter.com/1.1/media/upload.json`;
    // const options = {
    //   method: "POST",
    //   url: api_endpoint,
    //   params: {
    //     command: "INIT",
    //     total_bytes: fileSize,
    //     media_type: "image/jpeg",
    //   },
    //   // oauth_token: oauth_token,
    //   // oauth_token_secret: oauth_token_secret
    // };
    // const headers = {
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     Authorization: oauth.generateAuthHeader(options),
    //   },
    // };

    // const params = new URLSearchParams();
    // params.append("command", "INIT");
    // params.append("total_bytes", fileSize);
    // params.append("media_type", "image/jpeg");

    // axios
    //   .post(api_endpoint, params, headers)
    //   .then((response) => {
    //     return res.status(200).json(response.data);
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       return res.status(error.response.status).json(error);
    //     } else {
    //       console.log(error);
    //       return res.status(500).json(error.toString());
    //     }
    //   });
  });
};

module.exports = {
  initialize,
};
