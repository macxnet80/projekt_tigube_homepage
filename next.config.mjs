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
      // Beispiel: Alte "Über uns" Seite auf die neue Startseite umleiten
      // {
      //   source: '/ueber-uns.html',
      //   destination: '/',
      //   permanent: true,
      // },
      // Hier können weitere Weiterleitungen eingetragen werden.
      // Format: { source: '/alter-pfad', destination: '/neuer-pfad', permanent: true }
    ]
  },
}

export default nextConfig
