import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

function emptyToUndefined(value: unknown) {
    if (typeof value !== "string") {
        return value;
    }
    const v = value.trim();
    return v.length === 0 ? undefined : v;
}

const envSchema = z.object({
    NODE_ENV: z.union([z.undefined(), z.enum(["development", "production"])]),
    POSTGRES_HOST: z.preprocess(emptyToUndefined, z.string().optional()),
    POSTGRES_PORT: z
        .string()
        .regex(/^[0-9]+$/)
        .transform((value) => parseInt(value)),
    POSTGRES_DB: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    APP_PORT: z.union([
        z.undefined(),
        z
            .string()
            .regex(/^[0-9]+$/)
            .transform((value) => parseInt(value)),
    ]),
    WB_API_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
    WB_TARIFFS_BOX_CRON: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
    GOOGLE_SHEETS_SYNC_CRON: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
    GOOGLE_SHEETS_TARIFF_SHEET_NAME: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
    GOOGLE_SERVICE_ACCOUNT_JSON: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
    SPREADSHEET_ID: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
    LOG_LEVEL: z.preprocess(emptyToUndefined, z.enum(["error", "warn", "info", "http", "verbose", "debug", "silly"]).optional()),
});

const env = envSchema.parse({
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    NODE_ENV: process.env.NODE_ENV,
    APP_PORT: process.env.APP_PORT ?? process.env.PORT,

    WB_API_KEY: process.env.WB_API_KEY,
    WB_TARIFFS_BOX_CRON: process.env.WB_TARIFFS_BOX_CRON,
    GOOGLE_SHEETS_SYNC_CRON: process.env.GOOGLE_SHEETS_SYNC_CRON,
    GOOGLE_SHEETS_TARIFF_SHEET_NAME: process.env.GOOGLE_SHEETS_TARIFF_SHEET_NAME,
    GOOGLE_SERVICE_ACCOUNT_JSON: process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
    SPREADSHEET_ID: process.env.SPREADSHEET_ID,
    LOG_LEVEL: process.env.LOG_LEVEL,
});

export default env;
