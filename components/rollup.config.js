import resolve from "@rollup/plugin-node-resolve"; // 解析node_modules中的模块
import commonjs from "@rollup/plugin-commonjs"; // 将CommonJS模块转换为ES6
import babel from "@rollup/plugin-babel"; // 使用Babel转译JS/TS代码
import typescript from "rollup-plugin-typescript2"; // 处理TypeScript并生成类型声明
import { terser } from "rollup-plugin-terser"; // 压缩代码
import dts from "rollup-plugin-dts"; // 处理TypeScript类型声明文件
import nodeExternals from 'rollup-plugin-node-externals'
import { createRequire } from "module";
import { globby } from "globby";
import path from "path";
import { fileURLToPath } from "url";
const require = createRequire(import.meta.url);
const packageJson = require("./package.json");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const plugins = [
  nodeExternals({devDeps: true}),
  typescript({ tsconfig: "./tsconfig.json" }), // 处理TypeScript并生成类型声明
  resolve(), // 解析node_modules中的依赖
  commonjs(), // 转换CommonJS模块为ES6模块
  babel({
    babelHelpers: "bundled",
    exclude: ["node_modules/**"],
    extensions: [".js", ".jsx", ".ts", ".tsx"], // 处理JS、JSX、TS、TSX文件
    presets: [
      ["@babel/preset-react",{ runtime: "automatic"}], // 转译JSX语法
      ["@babel/preset-env", { modules: false }],
    ],
    plugins: [["babel-plugin-styled-components",{ssr: true}], "inline-react-svg"], // 支持styled-components
  }),

  terser(), // 压缩代码
  // dts(),
];

/**
 * @type {import('rollup').RollupOptions[]}
 */
export default [
  //ESM配置 
  {
    input: "./src/index.ts",
    output: {
      dir: "dist/esm",
      format: "esm",
      sourcemap: false,
      preserveModules: true, // 保持原始的模块结构
      preserveModulesRoot: "src", // 设置相对路径起点
    },
    plugins,
  },

  //CJS配置
  {
    input: "./src/index.ts",
    output: {
      dir: "dist/lib",
      format: "cjs",
      sourcemap: false,
      preserveModules: true,
      preserveModulesRoot: "src",
    },
    plugins,
  },

  //类型声明文件配置
  // {
  //   input: "dist/types/index.d.ts",
  //   output: [
  //     { dir: "dist/esm", format: "esm", preserveModules: true, preserveModulesRoot: "src" },
  //     { dir: "dist/lib", format: "cjs", preserveModules: true, preserveModulesRoot: "src" },
  //   ],
  //   // plugins: [dts()],
  // },
];

/**
 * @type {import('rollup').RollupOptions[]}
 */
// export default async () => {
//   const files = await globby(['src/index.ts',`**/*.tsx|*.ts|*.jsx`], {
//     ignore: [],
//   });
//   console.log(files, "files");

//   return {
//     input: files, //'src/index.ts',
//     external: [
//       ...Object.keys(Object.assign(packageJson.dependencies , packageJson.peerDependencies || {})),
//       'react/jsx-runtime',
//     ],
//     output: [
//       {
//         dir: "dist/esm",
//         format: "esm",
//         sourcemap: false,
//         entryFileNames: (chunk) => {
//           const relativePath = path.relative(path.resolve(__dirname, "src"), chunk.facadeModuleId);
  
//           // 3. 将替换路径分隔符为'/'
//           const normalizedPath = relativePath.replace(/\\/g, "/");
  
//           const outputFileName = normalizedPath.replace(/\.(tsx?|jsx?)$/, ".js");
//           console.log(outputFileName, "normalizedPath");
//           return `${outputFileName}`;
//         },
//       },
//       {
//         dir: "dist/cjs",
//         format: "cjs",
//         sourcemap: false,
//         entryFileNames: (chunk) => {
//           const relativePath = path.relative(path.resolve(__dirname, "src"), chunk.facadeModuleId);
  
//           // 3. 将替换路径分隔符为'/'
//           const normalizedPath = relativePath.replace(/\\/g, "/");
  
//           const outputFileName = normalizedPath.replace(/\.(tsx?|jsx?)$/, ".js");
//           return `${outputFileName}`;
//         },
//       },
//     ],

//     plugins,
//   };
// };
