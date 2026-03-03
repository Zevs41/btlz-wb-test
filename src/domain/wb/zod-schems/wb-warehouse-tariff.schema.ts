import { z } from "zod";

export const WbWarehouseTariffSchema = z.object({
    boxDeliveryBase: z.union([z.string(), z.null()]).optional(),
    boxDeliveryCoefExpr: z.union([z.string(), z.null()]).optional(),
    boxDeliveryLiter: z.union([z.string(), z.null()]).optional(),

    boxDeliveryMarketplaceBase: z.union([z.string(), z.null()]).optional(),
    boxDeliveryMarketplaceCoefExpr: z.union([z.string(), z.null()]).optional(),
    boxDeliveryMarketplaceLiter: z.union([z.string(), z.null()]).optional(),

    boxStorageBase: z.union([z.string(), z.null()]).optional(),
    boxStorageCoefExpr: z.union([z.string(), z.null()]).optional(),
    boxStorageLiter: z.union([z.string(), z.null()]).optional(),

    geoName: z.union([z.string(), z.null()]).optional(),
    warehouseName: z.string(),
});

export type WbBoxTariffWarehouse = z.infer<typeof WbWarehouseTariffSchema>;