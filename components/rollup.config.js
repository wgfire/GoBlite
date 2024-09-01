import resolve from "@rollup/plugin-node-resolve"; // 解析node_modules中的模块
import commonjs from "@rollup/plugin-commonjs"; // 将CommonJS模块转换为ES6
import babel from "@rollup/plugin-babel"; // 使用Babel转译JS/TS代码
import typescript from "rollup-plugin-typescript2"; // 处理TypeScript并生成类型声明
import { terser } from "rollup-plugin-terser"; // 压缩代码
// import dts from 'rollup-plugin-dts';  // 处理TypeScript类型声明文件
import { createRequire } from "module";
import { globby } from "globby";
import path from "path";
import { fileURLToPath } from "url";
const require = createRequire(import.meta.url);
const packageJson = require("./package.json");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * @type {import('rollup').RollupOptions[]}
 */
export default [
  // ESM配置
  {
    input: "./src/index.ts",
    external:["react","react-dom"],
    output: {
      dir: "dist/esm",
      format: "esm",
      sourcemap: false,
      preserveModules: true, // 保持原始的模块结构
      preserveModulesRoot: "src", // 设置相对路径起点
    },
    plugins: [
      resolve(), // 解析node_modules中的依赖
      commonjs(), // 转换CommonJS模块为ES6模块
      typescript({ tsconfig: "./tsconfig.json",tsconfigOverride:{
        compilerOptions: { declaration: true, declarationDir: "dist/types" },
      } }), // 处理TypeScript并生成类型声明
      babel({
        babelHelpers: "bundled",
        extensions: [".js", ".jsx", ".ts", ".tsx",".svg"], // 处理JS、JSX、TS、TSX文件
        presets: [
          "@babel/preset-env", // 转译现代JS语法
          "@babel/preset-react", // 转译JSX语法
        ],
        plugins: ["babel-plugin-styled-components",'inline-react-svg'], // 支持styled-components
      }),
      terser(), // 压缩代码
    ],
    external: Object.keys(packageJson.peerDependencies || {}),
  },

  // CJS配置
  // {
  //   input: "./index.ts",
  //   output: {
  //     dir: "dist/lib",
  //     format: "cjs",
  //     sourcemap: false,
  //     preserveModules: true,
  //     preserveModulesRoot: "./",
  //   },
  //   plugins: [
  //     resolve(),
  //     commonjs(),
  //     typescript({ tsconfig: "./tsconfig.json" }),
  //     babel({
  //       babelHelpers: "bundled",
  //       extensions: [".js", ".jsx", ".ts", ".tsx"],
  //       presets: ["@babel/preset-env", "@babel/preset-react"],
  //       plugins: ["babel-plugin-styled-components",'inline-react-svg'],
  //     }),
  //     terser(),
  //   ],
  //   external: Object.keys(packageJson.peerDependencies || {}),
  // },

  // 类型声明文件配置
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
//   const files = await globby([`**/*.tsx|*.ts|*.jsx`], {
//     ignore: ["index.ts"],
//   });
//   console.log(files, "files");

//   return {
//     input: files,
//     external:['react','react-dom'],
//     output: {
//       dir: "dist/esm",
//       format: "esm",
//       sourcemap: false,
//       entryFileNames: (chunk) => {
//         console.log(chunk, "chunk");
//         const relativePath = path.relative(path.resolve(__dirname),chunk.facadeModuleId);

//         // 3. 将相对路径转为小写并替换路径分隔符为'/'
//         const normalizedPath = relativePath.toLowerCase().replace(/\\/g, "/");
       
//         const outputFileName = normalizedPath.replace(/\.(tsx?|jsx?)$/, '.js');
//         console.log(outputFileName, "normalizedPath");
//         return `${outputFileName}`;
//       },
//     },
//     plugins: [
//       resolve(), // 解析node_modules中的依赖
//       commonjs(), // 转换CommonJS模块为ES6模块
//       typescript({ tsconfig: "./tsconfig.json" }), // 处理TypeScript并生成类型声明
//       babel({
//         babelHelpers: "bundled",
//         exclude: "node_modules/**",
//         extensions: [".js", ".jsx", ".ts", ".tsx"], // 处理JS、JSX、TS、TSX文件
//         presets: [
//           "@babel/preset-env", // 转译现代JS语法
//           "@babel/preset-react", // 转译JSX语法
//         ],
//         plugins: ["babel-plugin-styled-components", "inline-react-svg"], // 支持styled-components
//       }),
//       terser(), // 压缩代码
//     ],
//   };
// };
