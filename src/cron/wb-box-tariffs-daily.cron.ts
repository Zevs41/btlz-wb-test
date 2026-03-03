import cron from "node-cron";
import env from "#config/env/env.js";
import { logger } from "#common/logger/logger-config.js";

export function startScheduler(jobs: {
    fetchAndStoreTariffs: () => Promise<void>;
    syncSheets: () => Promise<void>;
}) {
    const wbCron = env.WB_TARIFFS_BOX_CRON ?? "10 * * * *";
    const sheetsCron = env.GOOGLE_SHEETS_SYNC_CRON ?? "11 * * * *";

    cron.schedule(wbCron, () => {
        void jobs.fetchAndStoreTariffs().catch((error) =>
            logger.error("[cron] fetchAndStoreTariffs failed", { error }),
        );
    });

    cron.schedule(sheetsCron, () => {
        void jobs.syncSheets().catch((error) => logger.error("[cron] syncSheets failed", { error }));
    });

    logger.info("[scheduler] started", { wbCron, sheetsCron });
}

