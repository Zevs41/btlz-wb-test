import env from "#config/env/env.js";
import { logger } from "#common/logger/logger-config.js";

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    if (!env.SPREADSHEET_ID) {
        logger.warn("[seed:spreadsheets] SPREADSHEET_ID is not set; skipping initial spreadsheet seed");
        return;
    }

    await knex("spreadsheets")
        .insert([{ spreadsheet_id: env.SPREADSHEET_ID }])
        .onConflict(["spreadsheet_id"])
        .ignore();
}
