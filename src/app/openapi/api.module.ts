import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { AdControllerService } from './api/adController.service';
import { CarpoolingControllerService } from './api/carpoolingController.service';
import { ChatControllerService } from './api/chatController.service';
import { CompanyControllerService } from './api/companyController.service';
import { ComplaintControllerService } from './api/complaintController.service';
import { DeliveryControllerService } from './api/deliveryController.service';
import { FastPostControllerService } from './api/fastPostController.service';
import { LeaveControllerService } from './api/leaveController.service';
import { NotificationControllerService } from './api/notificationController.service';
import { OrderControllerService } from './api/orderController.service';
import { PanierControllerService } from './api/panierController.service';
import { PaymentControllerService } from './api/paymentController.service';
import { ProductControllerService } from './api/productController.service';
import { PromotionControllerService } from './api/promotionController.service';
import { VehicleControllerService } from './api/vehicleController.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
