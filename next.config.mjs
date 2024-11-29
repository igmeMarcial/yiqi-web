/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
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
import { withSentryConfig } from '@sentry/nextjs'

// Only apply Sentry configuration if not explicitly disabled
const shouldSkipSentry =
  process.env.SENTRY_DISABLED === 'true' ||
  process.env.SKIP_SENTRY === 'true' ||
  !process.env.SENTRY_AUTH_TOKEN

export default withSentryConfig(nextConfig, {
  org: 'andino-labs-sac',
  project: 'javascript-nextjs',
  silent: !process.env.CI,
  telemetry: !shouldSkipSentry,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true
  },
  tunnelRoute: '/monitoring',
  hideSourceMaps: false,
  disableLogger: true,
  automaticVercelMonitors: true,
  sourcemaps: true
})
