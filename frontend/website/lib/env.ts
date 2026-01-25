import { z } from 'zod';

/**
 * Environment Variables Schema
 * Validates environment variables at build time using Zod.
 * If validation fails, the build will throw an error.
 */
const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().url({
        message: 'NEXT_PUBLIC_API_URL must be a valid URL',
    }),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Validate and parse environment variables.
 * This runs at module load time (build time for Next.js).
 */
const parseEnv = () => {
    const parsed = envSchema.safeParse({
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NODE_ENV: process.env.NODE_ENV,
    });

    if (!parsed.success) {
        console.error('❌ Invalid environment variables:');
        console.error(parsed.error.flatten().fieldErrors);
        throw new Error('Invalid environment variables. Check the console for details.');
    }

    return parsed.data;
};

export const env = parseEnv();

// Type-safe environment variable access
export type Env = z.infer<typeof envSchema>;
