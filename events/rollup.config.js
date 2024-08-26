import typescript from "rollup-plugin-typescript2";
import { globby } from "globby";
import path from "path";
const srcDir = "src";
const plugins = [typescript()];

const buildDist = async () => {
  const files = await globby([`${srcDir}/**/*.ts`], {
    ignore: [`${srcDir}/index.ts`],
  });
  const configs = files.map((file) => {
    const basePath = path.relative(srcDir, file);
    const baseName = path.basename(basePath, path.extname(basePath));
    const dirName = path.dirname(basePath);

    return {
      input: file,
      output: {
        file: `dist/umd/${dirName}/${baseName}.umd.js`,
        format: "umd",
        name: dirName,
        export: "named",
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
