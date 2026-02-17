const imagekit = require("../config/imagekit");
const fs = require("fs");

const uploadTextFile = async (filePath) => {
  const file = fs.readFileSync(filePath);

  const result = await imagekit.upload({
    file: file,
    fileName: filePath.split("/").pop(),
    folder: "/learning_app/descriptions"
  });

  fs.unlinkSync(filePath);

  return result.url;
};

module.exports = uploadTextFile;
