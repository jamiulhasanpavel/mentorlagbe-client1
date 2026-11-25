import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    const backendApiUrl = process.env.BACKEND_API_URL || "http://localhost:5000";

    if (process.env.NODE_ENV === "production" && !process.env.BACKEND_API_URL) {
      throw new Error("BACKEND_API_URL must be configured for production.");
    }

    return {
      fallback: [
        {
          source: "/api/:path*",
          destination: `${backendApiUrl.replace(/\/+$/, "")}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
