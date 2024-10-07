import typescript from "rollup-plugin-typescript2";
import { globby } from "globby";
import path from "path";
const srcDir = "src";
const plugins = [typescript({ tsconfig: "./tsconfig.json" })];

const buildDist = async () => {
  const files = await globby([`${srcDir}/**/*.ts`], {
    ignore: [`${srcDir}/index.ts`, `${srcDir}/**/*.d.ts`]
  });
  const configs = files.map(file => {
    const basePath = path.relative(srcDir, file);
    const dirName = path.dirname(basePath);

    return {
      input: file,
      output: {
        file: `dist/umd/${dirName}/${dirName}.umd.js`,
        format: "umd",
        name: dirName
      },
      plugins: [
        typescript({
          tsconfigOverride: {
            compilerOptions: { declaration: false, declarationDir: null }
          }
        })
      ]
    };
  });

  return [
    {
      input: "src/index.ts",
      output: {
        dir: "dist/lib",
        format: "cjs",
        exports: "auto",
        preserveModules: true, // 保持原始的模块结构
        interop: "auto"
      },
      plugins
    },
    {
      input: "src/index.ts",
      output: {
        dir: "dist/esm",
        format: "esm",
        exports: "auto",
        interop: "auto",
        preserveModules: true // 保持原始的模块结构
      },
      plugins
    },
    ...configs
  ];
};

export default buildDist;
