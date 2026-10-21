import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/media/[filename]": ["./1.jpeg", "./2.jpeg", "./3.jpeg", "./7.jpeg", "./8.jpeg", "./9.jpeg"],
  },
};

export default nextConfig;