import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Allow images from TMDB
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'image.tmdb.org',
                pathname: '/t/p/**',
            },
        ],
    },
};

export default nextConfig;
