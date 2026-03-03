import env from "#config/env/env.js";
import { google } from "googleapis";
import type { TariffRow } from "#domain/google/types/tariffs.types.js";
import { SCOPES } from "./consts/google-auth-scopes.const.js";

function toStringSafe(v: unknown): string {
    if (v === null || v === undefined) {
        return "";
    }
    return String(v);
}

function createGoogleAuth() {
    if (env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        const creds = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON) as {
            client_email: string;
            private_key: string;
        };
        return new google.auth.JWT({
            email: creds.client_email,
            key: creds.private_key,
            scopes: SCOPES,
        });
    }
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON must be set");
}

function createSheetsClient() {
    const auth = createGoogleAuth();
    return google.sheets({ version: "v4", auth });
}

async function ensureSheetExists(params: { spreadsheetId: string; sheetName: string }) {
    const sheets = createSheetsClient();
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: params.spreadsheetId });
    const exists = (spreadsheet.data.sheets ?? []).some((s) => s.properties?.title === params.sheetName);
    if (exists) {
        return;
    }

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: params.spreadsheetId,
        requestBody: {
            requests: [{ addSheet: { properties: { title: params.sheetName } } }],
        },
    });
}

export async function writeTariffsToSheet(params: {
    spreadsheetId: string;
    rows: TariffRow[];
}): Promise<{ rows: number }> {
    const sheets = createSheetsClient();
    const sheetName = env.GOOGLE_SHEETS_TARIFF_SHEET_NAME ?? "stocks_coefs";

    const values: string[][] = [
        [
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
        ],
        ...params.rows.map((r) => [
            toStringSafe(r.warehouse_name),
            toStringSafe(r.geo_name),
            toStringSafe(r.box_storage_coef_expr),
            toStringSafe(r.box_storage_base),
            toStringSafe(r.box_storage_liter),
            toStringSafe(r.box_delivery_coef_expr),
            toStringSafe(r.box_delivery_base),
            toStringSafe(r.box_delivery_liter),
            toStringSafe(r.box_delivery_marketplace_coef_expr),
            toStringSafe(r.box_delivery_marketplace_base),
            toStringSafe(r.box_delivery_marketplace_liter),
        ]),
    ];

    await ensureSheetExists({ spreadsheetId: params.spreadsheetId, sheetName });

    await sheets.spreadsheets.values.update({
        spreadsheetId: params.spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: "RAW",
        requestBody: { values },
    });

    return { rows: Math.max(0, values.length - 1) };
}

