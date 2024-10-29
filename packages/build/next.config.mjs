/** @type {import('next').NextConfig} */
const nextConfig = async () => {
  return {
    output: "export",
    assetPrefix: "/",
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
};

export default nextConfig;
