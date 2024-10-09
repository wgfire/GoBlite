import { globby } from "globby";
import { writeFile } from "fs/promises";
import path from "path";

/**
 * 自动加载components 各个子目录下的组件，生成index.tsx文件
 */
const autoIndexImport = async () => {
  const files = await globby("src/components/**/!(*index).tsx");
  console.log(files, "files");

  const imports = files.map(file => {
    const filePath = path.relative("src/components", file);
    const dirName = path.dirname(filePath);
    const baseName = path.basename(file, ".tsx");
    const importPath = `./${path.join(dirName, baseName)}`.replace(/\\/g, "/");
    return `export  *  from '${importPath}';`;
  });
  console.log(imports, "imports");

  const indexPath = path.resolve("src/components/index.tsx");
  await writeFile(indexPath, imports.join("\n"), "utf8");
};

// 执行函数
autoIndexImport().catch(console.error);
