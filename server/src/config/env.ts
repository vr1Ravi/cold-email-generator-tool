import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  GROQ_API_KEY: z.string(),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  CHROMA_API_KEY: z.string(),
  CHROMA_TENANT: z.string(),
  CHROMA_DATABASE: z.string(),
});

const env = envSchema.parse(process.env);

export default env;