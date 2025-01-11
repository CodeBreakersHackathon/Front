export interface ShoppingCartDto {
    items: number[]; // Activity ids
    currency: string;
    description: string;
    device_id: string | null;

    authentication_3DS?: any;
}


export interface ShoppingChargeDto {
    items: number[]; // Activity ids
    currency: string;
    token: string;
    device_id: string | null;
}