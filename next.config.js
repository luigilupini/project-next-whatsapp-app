/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  images: {
    domains: ["lh3.googleusercontent.com", "googleusercontent.com"],
  },
};

module.exports = nextConfig;
