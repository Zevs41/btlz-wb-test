export type TariffRow = {
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
};

