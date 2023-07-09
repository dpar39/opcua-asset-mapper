import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularSplitModule } from 'angular-split';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OpcUaConnectionComponent } from './opc-ua-connection/opc-ua-connection.component';
import { OpcUaAddressSpaceComponent } from './opc-ua-address-space/opc-ua-address-space.component';
import {
  faCoffee,
  faPlusSquare,
  faMinusSquare,
  faFileUpload,
} from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [
    AppComponent,
    OpcUaConnectionComponent,
    OpcUaAddressSpaceComponent,
  ],
  imports: [
    FontAwesomeModule,
    BrowserModule,
    AngularSplitModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIcons(faCoffee, faMinusSquare, faPlusSquare, faFileUpload);
  }
}
