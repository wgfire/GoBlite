/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  assetPrefix: process.env.NODE_ENV === "production" ? "." : "/",
};

// exportPathMap: async function (defaultPathMap, ctx) {
//   ctx.outDir = "out";
//   return {
//     "/page": { page: "/" }, // 使用/index 会产生一个index目录 导致引入地址不对
//     "/test": { page: "/test" },
//   };
// },
