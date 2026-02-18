const ImageKit = require("imagekit");
require("dotenv").config();

const imagekit = new ImageKit({
  publicKey: "public_Y/pGzdZ0bG0qNyJHMmM0FxNTek0=",
  privateKey: "private_xEp5KV2Y6h1A4Tt+pwrmSyy1v8M=",
  urlEndpoint: "https://ik.imagekit.io/8dydmbroa"
});

module.exports = imagekit;
