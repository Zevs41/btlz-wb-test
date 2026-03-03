/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    await knex.schema.createTable("wb_box_tariffs_daily", (table) => {
        table.date("tariff_date").notNullable();
        table.text("warehouse_name").notNullable();
        table.text("geo_name").notNullable().defaultTo("");

        table.decimal("box_delivery_base", null).nullable();
        table.decimal("box_delivery_coef_expr", null).nullable();
        table.decimal("box_delivery_liter", null).nullable();

        table.decimal("box_delivery_marketplace_base", null).nullable();
        table.decimal("box_delivery_marketplace_coef_expr", null).nullable();
        table.decimal("box_delivery_marketplace_liter", null).nullable();

        table.decimal("box_storage_base", null).nullable();
        table.decimal("box_storage_coef_expr", null).nullable();
        table.decimal("box_storage_liter", null).nullable();

        table.timestamp("fetched_at", { useTz: true }).notNullable();

        table.primary(["tariff_date", "warehouse_name", "geo_name"]);
        table.index(["tariff_date"]);
        table.index(["tariff_date", "box_storage_coef_expr"]);
    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    await knex.schema.dropTable("wb_box_tariffs_daily");
}

