import env from "#config/env/env.js";
import { formatDateYYYYMMDD } from "#common/utils/time.util.js";
import { logger } from "#common/logger/logger-config.js";
import { fetchWbBoxTariffs } from "#domain/wb/tariffs-box.domain.js";
import { upsertWbBoxTariffsDaily, getWbBoxTariffsForDate } from "#domain/db/wb-box-tariffs-daily/wb-box-tariffs-daily.domain.js";
import { listSpreadsheetIds } from "#domain/db/spreadsheets/spreadsheets.domain.js";
import { writeTariffsToSheet } from "#domain/google/google-sheet.domain.js";

function getTodayDate(): string {
    return formatDateYYYYMMDD(new Date());
}

export async function fetchAndStoreTariffs(): Promise<void> {
    if (!env.WB_API_KEY) {
        logger.warn("[wb] WB_API_KEY not set; skipping fetch");
        return;
    }

    const tariffDate = getTodayDate();
    const fetchedAt = new Date();

    const data = await fetchWbBoxTariffs({ date: tariffDate, apiKey: env.WB_API_KEY });
    const warehouses = data.response.data.warehouseList ?? [];
    const n = await upsertWbBoxTariffsDaily({ tariffDate, fetchedAt, warehouses });
    logger.info("[wb] upserted rows", { tariffDate, rows: n });
}

export async function syncSheets(): Promise<void> {
    const tariffDate = getTodayDate();
    const tariffRows = await getWbBoxTariffsForDate({ tariffDate });
    const spreadsheetIds = await listSpreadsheetIds();

    let totalRows = 0;
    for (const spreadsheetId of spreadsheetIds) {
        const res = await writeTariffsToSheet({ spreadsheetId, rows: tariffRows });
        totalRows += res.rows;
    }

    logger.info("[sheets] updated spreadsheets", {
        tariffDate,
        spreadsheets: spreadsheetIds.length,
        rows: totalRows,
    });
}

