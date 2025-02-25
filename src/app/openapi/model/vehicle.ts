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


export interface Vehicle { 
    idV?: string;
    brand?: string;
    model?: string;
    capacity?: string;
    licensePlate?: string;
    vin?: string;
    fabricationDate?: string;
    fuelType?: string;
    imageFileName?: string;
    vehicleStatus?: Vehicle.VehicleStatusEnum;
    vehicleType?: Vehicle.VehicleTypeEnum;
}
export namespace Vehicle {
    export type VehicleStatusEnum = 'inServer' | 'underRepair' | 'outOfService';
    export const VehicleStatusEnum = {
        InServer: 'inServer' as VehicleStatusEnum,
        UnderRepair: 'underRepair' as VehicleStatusEnum,
        OutOfService: 'outOfService' as VehicleStatusEnum
    };
    export type VehicleTypeEnum = 'car' | 'van' | 'motoCycle';
    export const VehicleTypeEnum = {
        Car: 'car' as VehicleTypeEnum,
        Van: 'van' as VehicleTypeEnum,
        MotoCycle: 'motoCycle' as VehicleTypeEnum
    };
}


