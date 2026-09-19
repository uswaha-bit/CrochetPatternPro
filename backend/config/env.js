import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env");   // backend/.env

const result = dotenv.config({ path: envPath });
console.log("env path:", envPath, "| keys loaded:", Object.keys(result.parsed ?? {}).length, "| error:", result.error?.message);

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),

  MONGO_URI: z.string().min(1),
  DB_LOCAL_URI: z.string().optional(),

  JWTSECRET: z.string().min(32, 'JWT secret should be at least 32 chars'),
  JWTEXPIRESIN: z.string().default('7d'),
  COOKIEEXPIRESTIME: z.coerce.number().default(7),

  NODEMAILER_HOST: z.string(),
  NODEMAILER_PORT: z.coerce.number(),
  NODEMAILER_USER: z.string(),
  NODEMAILER_PASSWORD: z.string(),
  NODEMAILER_FROM_EMAIL: z.string().email(),
  NODEMAILER_FROM_NAME: z.string(),

  AWS_S3_BUCKET_ACCESS_KEY_ID: z.string(),
  AWS_S3_BUCKET_SECRET_ACCESS_KEY: z.string(),
  AWS_S3_BUCKET_NAME: z.string(),
  AWS_S3_BUCKET_REGION: z.string(),
  AWS_S3_PRE_SIGNED_URL_EXPIRE_TIME: z.coerce.number().default(300),

  NEO4J_URI: z.string(),
  NEO4J_USER: z.string(),
  NEO4J_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),

  GEMINI_API_KEY: z.string(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

export const config = {
  env: env.NODE_ENV,
  isProd: env.NODE_ENV === 'production',
  port: env.PORT,
  mongoUri: env.MONGO_URI,
  jwt: { secret: env.JWTSECRET, expiresIn: env.JWTEXPIRESIN, cookieExpiresDays: env.COOKIEEXPIRESTIME },
  mail: {
    host: env.NODEMAILER_HOST,
    port: env.NODEMAILER_PORT,
    user: env.NODEMAILER_USER,
    password: env.NODEMAILER_PASSWORD,
    fromEmail: env.NODEMAILER_FROM_EMAIL,
    fromName: env.NODEMAILER_FROM_NAME,
  },
  aws: {
    accessKeyId: env.AWS_S3_BUCKET_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_S3_BUCKET_SECRET_ACCESS_KEY,
    bucket: env.AWS_S3_BUCKET_NAME,
    region: env.AWS_S3_BUCKET_REGION,
    presignExpiry: env.AWS_S3_PRE_SIGNED_URL_EXPIRE_TIME,
  },
  neo4j: { uri: env.NEO4J_URI, user: env.NEO4J_USER, password: env.NEO4J_PASSWORD, database: env.DATABASE_NAME },
  geminiApiKey: env.GEMINI_API_KEY,
};