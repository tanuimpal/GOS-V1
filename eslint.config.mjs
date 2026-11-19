import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    files: ['frontend/**/*.{ts,tsx}', 'shared/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/backend/**', '@/database/**', '**/backend/**', '**/database/**'],
              message: 'Frontend/shared code must not import server implementation.',
            },
          ],
          paths: [{ name: 'pg', message: 'Database access is server-only.' }],
        },
      ],
    },
  },
  {
    files: [
      'app/api/**/*.ts',
      'backend/domains/**/controller.ts',
      'backend/domains/**/service.ts',
      'backend/domains/**/contracts.ts',
      'backend/jobs/**/*.ts',
      'agents/**/*.ts',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/database/**', '**/database/**'],
              message:
                'Use the composition root and repository boundary; do not import database access here.',
            },
          ],
          paths: [{ name: 'pg', message: 'Only database adapters may use pg.' }],
        },
      ],
    },
  },
  globalIgnores([
    '.next/**',
    'next-env.d.ts',
    'node_modules/**',
    'upload/**',
    'playwright-report/**',
    'test-results/**',
    '.verification/**',
  ]),
]);
