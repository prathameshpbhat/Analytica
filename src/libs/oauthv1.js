const crypto = require("crypto");

module.exports = {
  // OAuth v1.0 authorization process

  // Create OAuth v1.0 nonce
  makeNonce: function () {
    var nonceLength = 32;
    return crypto
      .randomBytes(Math.ceil((nonceLength * 3) / 4))
      .toString("base64") // convert to base64 format
      .slice(0, nonceLength) // return required number of characters
      .replace(/\+/g, "0") // replace '+' with '0'
      .replace(/\//g, "0"); // replace '/' with '0'
  },

  // RFC 3986 percent encoding function
  fixedEncodeURIComponent: function (str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
      return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
  },

  // serialize parameters for signature
  serialize: function (obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(
          module.exports.fixedEncodeURIComponent(p) +
            "=" +
            module.exports.fixedEncodeURIComponent(obj[p])
        );
      }
    return str.join("&");
  },

  // Make function to generate OAuth v1.0 Authorization Header
  generateAuthHeader: function ({
    method,
    url,
    params,
    oauth_token = process.env.ACCESS_TOKEN,
    oauth_token_secret = process.env.ACCESS_TOKEN_SECRET,
  }) {
    let timestamp = Math.floor(Date.now() / 1000).toString();
    let authNonce = module.exports.makeNonce();

    // console.log(oauth_token);
    // console.log(oauth_token_secret);

    const unordered = {
      oauth_consumer_key: process.env.CONSUMER_KEY,
      oauth_nonce: authNonce,
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: timestamp,
      oauth_token: oauth_token,
      oauth_version: "1.0",
    };

    for (let key in params) {
      unordered[key] = params[key];
    }

    const ordered = Object.keys(unordered)
      .sort()
      .reduce((obj, key) => {
        obj[key] = unordered[key];
        return obj;
      }, {});

    const parameterString = module.exports.serialize(ordered);
    const signatureBaseString = `${method}&${module.exports.fixedEncodeURIComponent(
      url
    )}&${module.exports.fixedEncodeURIComponent(parameterString)}`;
    const signingKey = `${module.exports.fixedEncodeURIComponent(
      process.env.CONSUMER_SECRET
    )}&${module.exports.fixedEncodeURIComponent(oauth_token_secret)}`;
    const signature = crypto
      .createHmac("sha1", signingKey)
      .update(signatureBaseString)
      .digest("base64");

    let unencodedHeaderObject = {
      oauth_consumer_key: process.env.CONSUMER_KEY,
      oauth_nonce: authNonce,
      oauth_signature: signature,
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: timestamp,
      oauth_token: oauth_token,
      oauth_version: "1.0",
    };
    encodedHeaderObject = {};
    for (const key in unencodedHeaderObject) {
      encodedHeaderObject[
        module.exports.fixedEncodeURIComponent(key)
      ] = module.exports.fixedEncodeURIComponent(unencodedHeaderObject[key]);
    }
    let authstring = "OAuth";
    for (const key in encodedHeaderObject) {
      authstring = `${authstring} ${key}="${encodedHeaderObject[key]}",`;
    }
    authstring = authstring.slice(0, -1);
    return authstring;
  },
};
