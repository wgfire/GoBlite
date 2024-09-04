const path = require("path");
/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  assetPrefix: "/",
  webpack: (config, { dev, isServer }) => {
    config.resolve= {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        // "@platform/components": path.resolve(__dirname, "node_modules/@platform/components")
      },
      mainFields: ['module','main', 'browser'],
    }
    return config
  }
};

// exportPathMap: async function (defaultPathMap, ctx) {
//   ctx.outDir = "out";
//   return {
//     "/page": { page: "/" }, // 使用/index 会产生一个index目录 导致引入地址不对
//     "/test": { page: "/test" },
//   };
// },
