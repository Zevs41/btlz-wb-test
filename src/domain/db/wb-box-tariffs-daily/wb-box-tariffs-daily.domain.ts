import knex from "#postgres/knex.js";
import { parseRuNumber } from "#common/utils/number.util.js";
import type { WbBoxTariffWarehouse } from "#domain/wb/zod-schems/wb-warehouse-tariff.schema.js";
import type { WbBoxTariffsDailyRow } from "#domain/db/wb-box-tariffs-daily/types/wb-box-tariffs-daily.type.js";

export async function upsertWbBoxTariffsDaily(params: {
    tariffDate: string;
    fetchedAt: Date;
    warehouses: WbBoxTariffWarehouse[];
}): Promise<number> {
    const rows: WbBoxTariffsDailyRow[] = params.warehouses.map((w) => ({
        tariff_date: params.tariffDate,
        warehouse_name: w.warehouseName,
        geo_name: w.geoName ?? "",

        box_delivery_base: parseRuNumber(w.boxDeliveryBase),
        box_delivery_coef_expr: parseRuNumber(w.boxDeliveryCoefExpr),
        box_delivery_liter: parseRuNumber(w.boxDeliveryLiter),

        box_delivery_marketplace_base: parseRuNumber(w.boxDeliveryMarketplaceBase),
        box_delivery_marketplace_coef_expr: parseRuNumber(w.boxDeliveryMarketplaceCoefExpr),
        box_delivery_marketplace_liter: parseRuNumber(w.boxDeliveryMarketplaceLiter),

        box_storage_base: parseRuNumber(w.boxStorageBase),
        box_storage_coef_expr: parseRuNumber(w.boxStorageCoefExpr),
        box_storage_liter: parseRuNumber(w.boxStorageLiter),

        fetched_at: params.fetchedAt,
    }));

    if (rows.length === 0) {
        return 0;
    }

    await knex("wb_box_tariffs_daily")
        .insert(
            rows.map((r) => ({
                ...r,
            })),
        )
        .onConflict(["tariff_date", "warehouse_name", "geo_name"])
        .merge({
            box_delivery_base: knex.raw("excluded.box_delivery_base"),
            box_delivery_coef_expr: knex.raw("excluded.box_delivery_coef_expr"),
            box_delivery_liter: knex.raw("excluded.box_delivery_liter"),

            box_delivery_marketplace_base: knex.raw("excluded.box_delivery_marketplace_base"),
            box_delivery_marketplace_coef_expr: knex.raw("excluded.box_delivery_marketplace_coef_expr"),
            box_delivery_marketplace_liter: knex.raw("excluded.box_delivery_marketplace_liter"),

            box_storage_base: knex.raw("excluded.box_storage_base"),
            box_storage_coef_expr: knex.raw("excluded.box_storage_coef_expr"),
            box_storage_liter: knex.raw("excluded.box_storage_liter"),

            fetched_at: knex.raw("excluded.fetched_at"),
        });

    return rows.length;
}

export async function getWbBoxTariffsForDate(params: { tariffDate: string }): Promise<
    Array<{
        warehouse_name: string;
        geo_name: string;
        box_storage_coef_expr: string | number | null;
        box_storage_base: string | number | null;
        box_storage_liter: string | number | null;
        box_delivery_coef_expr: string | number | null;
        box_delivery_base: string | number | null;
        box_delivery_liter: string | number | null;
        box_delivery_marketplace_coef_expr: string | number | null;
        box_delivery_marketplace_base: string | number | null;
        box_delivery_marketplace_liter: string | number | null;
    }>
> {
    return knex("wb_box_tariffs_daily")
        .select(
            "warehouse_name",
            "geo_name",
            "box_storage_coef_expr",
            "box_storage_base",
            "box_storage_liter",
            "box_delivery_coef_expr",
            "box_delivery_base",
            "box_delivery_liter",
            "box_delivery_marketplace_coef_expr",
            "box_delivery_marketplace_base",
            "box_delivery_marketplace_liter",
        )
        .where({ tariff_date: params.tariffDate })
        .orderByRaw("box_storage_coef_expr ASC NULLS LAST, warehouse_name ASC, geo_name ASC");
}

