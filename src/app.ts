import http from "node:http";
import env from "#config/env/env.js";
import knex, { migrate, seed } from "#postgres/knex.js";
import { logger } from "#common/logger/logger-config.js";
import { startScheduler } from "#cron/wb-box-tariffs-daily.cron.js";
import { fetchAndStoreTariffs, syncSheets } from "#services/wb/tariffs-box.service.js";

const port = env.APP_PORT ?? 5000;

await migrate.latest();
await seed.run();
logger.info("[boot] migrations and seeds done");

await fetchAndStoreTariffs().catch((error) => logger.error("[boot] initial WB fetch failed", { error }));
await syncSheets().catch((error) => logger.error("[boot] initial Sheets sync failed", { error }));

startScheduler({ fetchAndStoreTariffs, syncSheets });

const server = http.createServer((_req, res) => {
    res.statusCode = 200;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: true }));
});
server.listen(port, () => logger.info("[http] listening", { port }));

async function gracefulShutdown(signal: string) {
    logger.info("[shutdown] signal received", { signal });
    server.close();
    await knex.destroy().catch(() => undefined);
    process.exit(0);
}

process.on("SIGTERM", () => {
    void gracefulShutdown("SIGTERM");
});

process.on("SIGINT", () => {
    void gracefulShutdown("SIGINT");
});