/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/Start',
        destination: '/',
        permanent: false,
      },
      {
        source: '/Hundepension',
        destination: '/hundepension',
        permanent: false,
        caseSensitive: true,
      },
      {
        source: '/Unsere-Leistungen',
        destination: '/#leistungen',
        permanent: false,
      },
      {
        source: '/Kundenstimmen',
        destination: '/kundenstimmen',
        permanent: false,
        caseSensitive: true,
      },
      {
        source: '/SeminareWorkshops',
        destination: '/',
        permanent: false,
      },
      {
        source: '/Katzenbetreuung',
        destination: '/katzenbetreuung',
        permanent: false,
        caseSensitive: true,
      },
    ]
  },
}

export default nextConfig
