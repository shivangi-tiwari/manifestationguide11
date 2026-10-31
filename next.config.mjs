/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/about', destination: '/#about', permanent: true },
      { source: '/videos', destination: '/#videos', permanent: true },
      { source: '/success-stories', destination: '/#stories', permanent: true },
      { source: '/contact', destination: '/#contact', permanent: true },
      { source: '/packages', destination: '/#contact', permanent: true },
      { source: '/faq', destination: '/#contact', permanent: true },
    ]
  },
};

export default nextConfig;