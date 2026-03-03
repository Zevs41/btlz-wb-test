import knex from "#postgres/knex.js";

export async function listSpreadsheetIds(): Promise<string[]> {
    const rows = await knex("spreadsheets").select("spreadsheet_id").orderBy("spreadsheet_id", "asc");
    return rows.map((r) => r.spreadsheet_id).filter(Boolean);
}

