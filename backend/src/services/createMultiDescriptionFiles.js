const fs = require("fs");
const path = require("path");

const createMultiDescriptionFiles = (descriptions) => {
  const uploadDir = "uploads";

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const filePaths = {};

  Object.keys(descriptions).forEach((lang) => {
    const fileName = `desc_${lang}_${Date.now()}.txt`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, descriptions[lang], "utf8");

    filePaths[lang] = filePath;
  });

  return filePaths;
};

module.exports = createMultiDescriptionFiles;