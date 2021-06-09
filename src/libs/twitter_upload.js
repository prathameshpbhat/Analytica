const axios = require("axios");
const oauth = require(`./oauthv1`);

const init = async (fileSize, fileMimeType) => {
  try {
    const api_endpoint = `https://upload.twitter.com/1.1/media/upload.json`;
    const options = {
      method: "POST",
      url: api_endpoint,
      params: {
        command: "INIT",
        total_bytes: fileSize,
        media_type: fileMimeType,
      },
      // oauth_token: oauth_token,
      // oauth_token_secret: oauth_token_secret
    };
    const headers = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: oauth.generateAuthHeader(options),
      },
    };

    const params = new URLSearchParams();
    params.append("command", "INIT");
    params.append("total_bytes", fileSize);
    params.append("media_type", fileMimeType);

    const response = await axios.post(api_endpoint, params, headers);

    return Promise.resolve(response.data.media_id_string);
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

const append = async (chunkArray, media_id) => {
  try {
    const api_endpoint = `https://upload.twitter.com/1.1/media/upload.json`;
    for (let i = 0; i < chunkArray.length; i++) {
      const options = {
        method: "POST",
        url: api_endpoint,
        params: {
          command: "APPEND",
          media_id: media_id,
          media_data: chunkArray[i],
          segment_index: i,
        },
        // oauth_token: oauth_token,
        // oauth_token_secret: oauth_token_secret,
      };
      const headers = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: oauth.generateAuthHeader(options),
        },
      };
      const params = new URLSearchParams();
      params.append("command", "APPEND");
      params.append("media_id", media_id);
      params.append("media_data", chunkArray[i]);
      params.append("segment_index", i);

      const response = await axios.post(api_endpoint, params, headers);
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error.response.data);
  }
};

const finalize = async (media_id) => {
  try {
    const api_endpoint = `https://upload.twitter.com/1.1/media/upload.json`;
    const options = {
      method: "POST",
      url: api_endpoint,
      params: {
        command: "FINALIZE",
        media_id: media_id,
      },
      // oauth_token: oauth_token,
      // oauth_token_secret: oauth_token_secret
    };
    const headers = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: oauth.generateAuthHeader(options),
      },
    };
    const params = new URLSearchParams();
    params.append("command", "FINALIZE");
    params.append("media_id", media_id);
    const response = await axios.post(api_endpoint, params, headers);
    // console.log(response.data);
    return Promise.resolve(response.data);
  } catch (error) {
    // console.log(error);
    return Promise.reject(error.response.data);
  }
};

module.exports = {
  init,
  append,
  finalize,
};
