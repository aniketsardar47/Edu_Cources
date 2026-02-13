const generateUrls = (url) => {
  return {
    p240: `${url}?tr=w-426,h-240`,
    p360: `${url}?tr=w-640,h-360`,
    p720: `${url}?tr=w-1280,h-720`
  };
};

module.exports = generateUrls;
