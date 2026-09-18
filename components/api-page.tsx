'use client';

import { createOpenAPIPage } from 'fumadocs-openapi/ui';
import { createCodeUsageGeneratorRegistry } from 'fumadocs-openapi/requests/generators';
import { curl } from 'fumadocs-openapi/requests/generators/curl';
import { javascript } from 'fumadocs-openapi/requests/generators/javascript';
import { python } from 'fumadocs-openapi/requests/generators/python';

// Request samples in the three languages the SDK story covers.
const codeUsages = createCodeUsageGeneratorRegistry();
codeUsages.add('curl', curl);
codeUsages.add('javascript', javascript);
codeUsages.add('python', python);

export const OpenAPIPage = createOpenAPIPage({ codeUsages });
