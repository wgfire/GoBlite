/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ["@go-blite/shadcn"],
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
