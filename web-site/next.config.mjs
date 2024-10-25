/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
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
