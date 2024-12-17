/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { // [!code ++] // [!code focus]
    serverComponentsExternalPackages: ['grammy'], // [!code ++] // [!code focus]
  },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          port: '',
          pathname: '/duscymcfc/image/upload/**',
        },
      ],
    },
  };
  
  export default nextConfig;
  