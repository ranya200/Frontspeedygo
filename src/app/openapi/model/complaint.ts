/**
 * SpeedyGo API
 * Navigators Team API
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface Complaint { 
    id?: string;
    title?: string;
    description?: string;
    category?: Complaint.CategoryEnum;
    status?: Complaint.StatusEnum;
}
export namespace Complaint {
    export type CategoryEnum = 'DELIVERY' | 'PAYMENT' | 'TECHNICAL' | 'OTHER';
    export const CategoryEnum = {
        Delivery: 'DELIVERY' as CategoryEnum,
        Payment: 'PAYMENT' as CategoryEnum,
        Technical: 'TECHNICAL' as CategoryEnum,
        Other: 'OTHER' as CategoryEnum
    };
    export type StatusEnum = 'PENDING' | 'OPENED' | 'TREATED';
    export const StatusEnum = {
        Pending: 'PENDING' as StatusEnum,
        Opened: 'OPENED' as StatusEnum,
        Treated: 'TREATED' as StatusEnum
    };
}


