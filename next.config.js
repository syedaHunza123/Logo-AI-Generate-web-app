/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['oaidalleapiprodscus.blob.core.windows.net', 'localhost'],
  },
  env: {
    NEXTAUTH_SECRET: 'secure_nextauth_secret_for_jwt_encryption',
    NEXTAUTH_URL: 'http://localhost:3000',
  },
}

module.exports = nextConfig