/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.igdb.com",
      },
      {
        protocol: "https",
        hostname: "assetsio.reedpopcdn.com",
      },
      {
        protocol: "https",
        hostname: "assetsio.gnwcdn.com",
      },
      {
        protocol: "https",
        hostname: "i.kinja-img.com",
      },
      {
        protocol: "https",
        hostname: "www.destructoid.com",
      },
    ],
  },
};

module.exports = nextConfig;
