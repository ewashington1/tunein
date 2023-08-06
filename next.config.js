/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  env: {
    NEXTAUTH_SECRET: "hR8EzwDOA7AJA4H5q00GTPpEpm5Uz85DUP7W6WHi35I=",
  },
};

module.exports = nextConfig;
