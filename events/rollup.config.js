import typescript from "rollup-plugin-typescript2";
import { globby } from "globby";
import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
const srcDir = "src";
const plugins = [typescript(), commonjs()];

const buildDist = async () => {
  const files = await globby([`${srcDir}/**/*.ts`], {
    ignore: [`${srcDir}/index.ts`],
  });
  const configs = files.map((file) => {
    const basePath = path.relative(srcDir, file);
    const dirName = path.dirname(basePath);

    return {
      input: file,
      output: {
        file: `dist/umd/${dirName}/${dirName}.umd.js`,
        format: "umd",
        name: dirName,
      },
      plugins: [
        typescript({
          tsconfig: "./tsconfig.json",
          tsconfigOverride: {
            compilerOptions: { declaration: false, declarationDir: null },
          },
        }),
      ],
    };
  });

  return [
    {
      input: "src/index.ts",
      output: {
        file: "dist/index.js",
        format: "cjs",
        exports: "auto",
      },
      plugins,
    },
    {
      input: "src/index.ts",
      output: {
        file: "dist/index.esm.js",
        format: "esm",
        exports: "default",
      },
      plugins,
    },
    ...configs,
  ];
};

export default buildDist;
