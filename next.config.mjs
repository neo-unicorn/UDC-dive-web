/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '**.blob.vercel-storage.com',
      },
    ],
  },
  
  // 实验性功能
  experimental: {
    // 启用服务器操作
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
