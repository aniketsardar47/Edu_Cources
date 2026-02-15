const ImageKit = require("imagekit");
require("dotenv").config();

const imagekit = new ImageKit({
  publicKey: "public_cOAXtcJYZnkRstg6yJBfr5+p0+8=",
  privateKey: "private_xti0I8vFoFXWjH0+0LtRA7qzHok=",
  urlEndpoint: "https://ik.imagekit.io/5xf9qpp4o"
});

module.exports = imagekit;
