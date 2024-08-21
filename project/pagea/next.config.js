// module.exports = {
//   assetPrefix:
//     process.env.NODE_ENV === 'production' ? '/examples/landing' : '/',
// };
const path = require("path");

module.exports = {
  assetPrefix: process.env.NODE_ENV === "production" ? "/project/pagea" : "/",
  transpilePackages: ['@platform/components'],  
};
