import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.0.100'],
  images:{
    remotePatterns:[
      {hostname:"lh3.googleusercontent.com"},
      {hostname:"res.cloudinary.com"},
      {hostname:"images.unsplash.com"},
      {hostname:"plus.unsplash.com"},
      {hostname:"icons8.com"},

    ]
  }
};

export default nextConfig;
