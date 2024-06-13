import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FacturaComponent } from './FAC/componente/factura/factura.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { faCoffee, fas, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { TablaDatosComponent } from './FAC/componente/tabla-datos/tabla-datos.component';
import { FactDeliveryComponent } from './FAC/componente/factura/fact-delivery/fact-delivery.component';
import { FactFichaProductoComponent } from './FAC/componente/factura/fact-ficha-producto/fact-ficha-producto.component';
import { FactConfirmarComponent } from './FAC/componente/factura/fact-confirmar/fact-confirmar.component';
import { FactRevisionComponent } from './FAC/componente/factura/fact-revision/fact-revision.component';
import { FactBonificacionLibreComponent } from './FAC/componente/factura/fact-bonificacion-libre/fact-bonificacion-libre.component';
import { WaitComponent } from './SHARED/componente/wait/wait.component';
import { SidebarComponent } from './SHARED/componente/sidebar/sidebar.component';
import { LoginComponent } from './SHARED/componente/login/login.component';
import { DynamicFormDirective } from './SHARED/directive/dynamic-form.directive';
import { RegistroFacturaComponent } from './FAC/componente/factura/registro-factura/registro-factura.component';
import { DialogErrorComponent } from './SHARED/componente/dialog-error/dialog-error.component';
import { IgxComboModule, IgxDatePickerModule } from 'igniteui-angular';
import { IgxIconModule } from 'igniteui-angular';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import { AnularComponent } from './SHARED/anular/anular.component';
import {MatTableModule} from '@angular/material/table';
import { DialogoConfirmarComponent } from './SHARED/componente/dialogo-confirmar/dialogo-confirmar.component';
import { ImprimirFacturaComponent } from './FAC/componente/factura/registro-factura/imprimir-factura/imprimir-factura.component';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

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
    WaitComponent,
    SidebarComponent,
    LoginComponent,
    DynamicFormDirective,
    RegistroFacturaComponent,
    DialogErrorComponent,
    AnularComponent,
    DialogoConfirmarComponent,
    ImprimirFacturaComponent,
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
    MatIconModule,
    IgxComboModule,
    IgxIconModule,
    MatPaginatorModule,
    MatTableModule,
    IgxDatePickerModule,
     BackButtonDisableModule.forRoot({
      preserveScroll: true // DISABLE BACK
    })
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() },
    { provide: LocationStrategy, useClass: HashLocationStrategy}
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
    library.addIcons(faCoffee);
  }
  
}


export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = "Registros por página";

  return customPaginatorIntl;
}

