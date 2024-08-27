/**
 * @type {import('next').NextConfig}
 */
const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyUmdPlugin = require("./copy-webpack-plug");

const events = ["register", "login"];

// 获取要插入的脚本路径
const scriptsToInsert = events
  .map((event) => {
    const scriptPath = path.resolve(__dirname, "node_modules/@platform/events/dist/umd", `${event}/${event}.umd.js`);
    if (fs.existsSync(scriptPath)) {
      return scriptPath;
    }
    return null;
  })
  .filter(Boolean);

console.log("scriptsToInsert", scriptsToInsert);
module.exports = {
  assetPrefix: ".",
  transpilePackages: ["@platform/components"],
  exportPathMap: async function (defaultPathMap, ctx) {
    ctx.outDir = "out";
    return {
      "/page": { page: "/" },
    };
  },
  webpack(config, { dev, isServer }) {
    console.log(dev, isServer, "环境");
    if (!dev && !isServer) {
      console.log("config.externals", config.externals);
      config.externals = config.externals || [];
      config.externals.push({
        "@platform/events": "[]",
      });
    }
    config.plugins.push(
      new CopyUmdPlugin({
        scripts: scriptsToInsert,
        outputPath: path.resolve(__dirname, ".next/static/chunks"),
      })
    );
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.done.tap("InsertScriptsPlugin", (stats) => {
          // done 也会执行多次
          const htmlFilePath = path.resolve(__dirname, ".next/server/pages/index.html");
          if (!fs.existsSync(htmlFilePath)) {
            return false;
          }

          let htmlContent = fs.readFileSync(htmlFilePath, "utf8");

          events.forEach((script) => {
            const scriptTag = `<script src="/_next/static/chunks/${script}.umd.js"></script>`;
            htmlContent = htmlContent.replace("</body>", `${scriptTag}</body>`);
          });

          fs.writeFileSync(htmlFilePath, htmlContent, "utf8");
          console.log("Inserted scripts into page.html");
        });
      },
    });
    return config;
  },
};
