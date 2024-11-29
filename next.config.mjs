import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'lh3.googleusercontent.com'
      },
      {
        hostname: 'images.unsplash.com'
      },
      {
        hostname: 'randomuser.me'
      },
      {
        // Matches any bucket in the 's3.us-east-1.amazonaws.com' region
        hostname: '*.s3.us-east-1.amazonaws.com'
      },
      {
        // Matches any bucket in the 's3.us-east-1.amazonaws.com' region
        hostname: '*.s3.us-east-2.amazonaws.com'
      },
      {
        hostname: 'www.yiqi.lat'
      }
    ]
  }
}

export default withNextIntl(nextConfig)
