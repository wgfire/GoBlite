/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  assetPrefix: "/",
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
  }
};

export default nextConfig;
