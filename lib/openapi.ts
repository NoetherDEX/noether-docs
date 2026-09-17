// Server-side OpenAPI instance (never import from client components).
import { createOpenAPI } from 'fumadocs-openapi/server';

export const openapi = createOpenAPI({
  input: ['./public/openapi.json'],
});
