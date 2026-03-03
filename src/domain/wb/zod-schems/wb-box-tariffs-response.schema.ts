import { z } from "zod";
import { WbWarehouseTariffSchema } from "./wb-warehouse-tariff.schema.js";

export const WbBoxTariffsResponseSchema = z.object({
    response: z.object({
        data: z.object({
            dtNextBox: z.string().optional(),
            dtTillMax: z.string().optional(),
            warehouseList: z.array(WbWarehouseTariffSchema).default([]),
        }),
    }),
});

export type WbBoxTariffsResponse = z.infer<typeof WbBoxTariffsResponseSchema>;