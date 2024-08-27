const fs = require("fs");
const path = require("path");

class CopyUmdPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.done.tap("CopyUmdPlugin", (stats) => {
      const { scripts, outputPath } = this.options;
      // 确保输出目录存在
      if (!fs.existsSync(outputPath)) {
        return false;
      }
      console.log("scripts", scripts, outputPath, "复制插件");
      scripts.forEach((script) => {
        const destPath = path.join(outputPath, path.basename(script));
        fs.copyFileSync(script, destPath);
      });
      console.log(`复制完成`);
    });
  }
}

module.exports = CopyUmdPlugin;
