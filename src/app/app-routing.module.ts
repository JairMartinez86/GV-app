import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './SHARED/login/login.component';
import { SidebarComponent } from './SHARED/componente/sidebar/sidebar.component';

const routes: Routes = [
  { path: 'Login', component: LoginComponent },
  { path: 'Menu', component: SidebarComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
