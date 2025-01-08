/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  assetPrefix: "/",
  distDir: process.env.BUILD_ID ? `.build-cache/${process.env.BUILD_ID}/.next` : ".next",
  images: {
    unoptimized: true
  },
  webpack: config => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias
      },
      mainFields: ["module", "main", "browser"]
    };
    return config;
  },
  // 配置需要生成的静态页面路径
  pageExtensions: ["js", "jsx", "ts", "tsx"]
};

export default () => {
  // 开发环境保持默认配置
  return nextConfig;
};
