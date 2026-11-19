import type { NextConfig } from 'next';
import { PHASE_PRODUCTION_SERVER, PHASE_DEVELOPMENT_SERVER } from 'next/constants';
import { parseEnvironment } from './backend/config/validation';

export default function config(phase: string): NextConfig {
  if (phase === PHASE_PRODUCTION_SERVER || phase === PHASE_DEVELOPMENT_SERVER) {
    parseEnvironment(process.env, { productionRuntime: phase === PHASE_PRODUCTION_SERVER });
  }
  return {
    // Acceptance builds own a dedicated ignored directory; preserve developer caches.
    distDir: process.env.GOS_LOCAL_TEST_DIST_DIR || '.next',
    poweredByHeader: false,
    reactStrictMode: true,
    logging: { incomingRequests: { ignore: [/\/api\/v1\/social\/oauth\/callback/] } },
    serverExternalPackages: ['pg'],
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'Referrer-Policy', value: 'no-referrer' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          ],
        },
        {
          source: '/owner-invitation',
          headers: [{ key: 'Referrer-Policy', value: 'same-origin' }],
        },
      ];
    },
  };
}
