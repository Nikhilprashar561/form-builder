import { z } from "zod";
import "dotenv/config"

const envSchema = z.object({
  PORT: z.string(),
  NODE_ENV: z.enum(["development", "prod"]).default("development"),
  BASE_URL: z.string().default("http://localhost:8000"),
  NODEMAILER_GMAIL: z.string().optional(),
  NODEMAILER_GMAIL_PASS: z.string().optional()
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);

console.log("env aya kya",env)
