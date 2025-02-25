/**
 * OpenAPI definition
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface Delivery { 
    idD?: string;
    deliveryStatus?: Delivery.DeliveryStatusEnum;
    estimatedDeliveryTime?: string;
    pamentStatus?: Delivery.PamentStatusEnum;
}
export namespace Delivery {
    export type DeliveryStatusEnum = 'Pending' | 'InRoad' | 'Done';
    export const DeliveryStatusEnum = {
        Pending: 'Pending' as DeliveryStatusEnum,
        InRoad: 'InRoad' as DeliveryStatusEnum,
        Done: 'Done' as DeliveryStatusEnum
    };
    export type PamentStatusEnum = 'PAID' | 'UNPAID';
    export const PamentStatusEnum = {
        Paid: 'PAID' as PamentStatusEnum,
        Unpaid: 'UNPAID' as PamentStatusEnum
    };
}


