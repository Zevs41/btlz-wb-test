import type { WbBoxTariffsResponse } from "./zod-schems/wb-box-tariffs-response.schema.js";
import { WbBoxTariffsResponseSchema } from "./zod-schems/wb-box-tariffs-response.schema.js";

export async function fetchWbBoxTariffs(params: { date: string; apiKey: string }): Promise<WbBoxTariffsResponse> {
    const url = new URL("https://common-api.wildberries.ru/api/v1/tariffs/box");
    url.searchParams.set("date", params.date);

    const res = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: params.apiKey,
        },
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`WB tariffs/box request failed: ${res.status} ${res.statusText}${text ? `; body=${text}` : ""}`);
    }

    const json = await res.json();
    return WbBoxTariffsResponseSchema.parse(json);
}

