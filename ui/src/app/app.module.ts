import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularSplitModule } from 'angular-split';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OpcUaConnectionComponent } from './opc-ua-connection/opc-ua-connection.component';
import { OpcUaAddressSpaceComponent } from './opc-ua-address-space/opc-ua-address-space.component';

@NgModule({
  declarations: [
    AppComponent,
    OpcUaConnectionComponent,
    OpcUaAddressSpaceComponent,
  ],
  imports: [
    BrowserModule,
    AngularSplitModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
