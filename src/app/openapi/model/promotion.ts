/**
 * SpeedyGo API
 * API documentation for SpeedyGo
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface Promotion { 
    id?: string;
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    discountType?: Promotion.DiscountTypeEnum;
    discount?: number;
    promotionStatus?: Promotion.PromotionStatusEnum;
}
export namespace Promotion {
    export type DiscountTypeEnum = 'POURCENTAGE' | 'FIXEDAMOUNT' | 'FREEDELIVERY';
    export const DiscountTypeEnum = {
        Pourcentage: 'POURCENTAGE' as DiscountTypeEnum,
        Fixedamount: 'FIXEDAMOUNT' as DiscountTypeEnum,
        Freedelivery: 'FREEDELIVERY' as DiscountTypeEnum
    };
    export type PromotionStatusEnum = 'ACTIVE' | 'EXPIRED';
    export const PromotionStatusEnum = {
        Active: 'ACTIVE' as PromotionStatusEnum,
        Expired: 'EXPIRED' as PromotionStatusEnum
    };
}


