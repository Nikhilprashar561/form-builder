import { z } from "zod"

export const envSchema = z.object({
      NODEMAILER_GMAIL: z.string(),
      NODEMAILER_GMAIL_PASS: z.string()
})

function createEnv(env: NodeJS.ProcessEnv){
    const envData = envSchema.safeParse(env);
    if(!envData.success) throw new Error(envData.error.message);
    return envData.data
}

export const env = createEnv(process.env)
