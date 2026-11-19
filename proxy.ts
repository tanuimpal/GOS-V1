import { authkitProxy } from '@workos-inc/authkit-nextjs';
import { createWorkOSProxy } from '@/backend/access/workos-proxy';

export default createWorkOSProxy(authkitProxy);

export const config = {
  matcher: [
    '/master/:path*',
    '/client/:path*',
    '/api/v1/:path*',
    '/auth/session-ready',
    '/onboarding/:path*',
  ],
};
