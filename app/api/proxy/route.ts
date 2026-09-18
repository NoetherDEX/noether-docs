import { openapi } from '@/lib/openapi';
import { site } from '@/lib/site';

// The API playground calls the gateway through this proxy because the
// gateway's CORS policy does not include the docs origin. Only the gateway
// origin may be targeted.
export const { GET, HEAD, PUT, POST, PATCH, DELETE } = openapi.createProxy({
  allowedOrigins: [site.gateway],
});
