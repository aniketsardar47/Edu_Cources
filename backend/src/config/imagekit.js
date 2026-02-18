const ImageKit = require("imagekit");
require("dotenv").config();

const imagekit = new ImageKit({
  publicKey: "public_Wjtwxzb3s7UztZpUmd32AlmRKN0=",
  privateKey: "private_Ops5Hr/Sx4DJyncMwMe6v3MIjS0=",
  urlEndpoint: "https://ik.imagekit.io/evh2jgd9o"
});

module.exports = imagekit;
