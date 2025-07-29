/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only include what you're actually using
  async headers() {
    return [{
      source: '/api/:path*',
      headers: [
        { 
          key: 'Access-Control-Allow-Origin', 
          value: "https://f4a22725f3fa.ngrok-free.app"
        }
      ]
    }]
  }
};

module.exports = nextConfig;