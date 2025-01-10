/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  assetPrefix: "/",
  // distDir: process.env.BUILD_ID ? `.build-cache/${process.env.BUILD_ID}/.next` : ".next",
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
  eslint: {
    ignoreDuringBuilds: true
  },
  pageExtensions: ["js", "jsx", "ts", "tsx"]
};

export default nextConfig;
