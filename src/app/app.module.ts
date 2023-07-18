import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FacturaComponent } from './FAC/factura/factura.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { FontAwesomeModule, FaIconLibrary   } from '@fortawesome/angular-fontawesome';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';

import { faCoffee, fas, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { TablaDatosComponent } from './FAC/tabla-datos/tabla-datos.component';
import { FactDeliveryComponent } from './FAC/fact-delivery/fact-delivery.component';
import { FactFichaProductoComponent } from './FAC/fact-ficha-producto/fact-ficha-producto.component';
import { FactConfirmarComponent } from './FAC/fact-confirmar/fact-confirmar.component';
import { FactRevisionComponent } from './FAC/fact-revision/fact-revision.component';
import { FactBonificacionLibreComponent } from './FAC/fact-bonificacion-libre/fact-bonificacion-libre.component';


@NgModule({
  declarations: [
    AppComponent,
    FacturaComponent,
    TablaDatosComponent,
    FactDeliveryComponent,
    FactFichaProductoComponent,
    FactConfirmarComponent,
    FactRevisionComponent,
    FactBonificacionLibreComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    FontAwesomeModule,
    MatDialogModule,
    MatIconModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
    library.addIcons(faCoffee);
  }
 }
