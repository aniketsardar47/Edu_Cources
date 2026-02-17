const fs = require("fs");

const createDescriptionFile = (text) => {
  const fileName = `desc_${Date.now()}.txt`;
  const filePath = `uploads/${fileName}`;

  fs.writeFileSync(filePath, text);

  return filePath;
};

module.exports = createDescriptionFile;
