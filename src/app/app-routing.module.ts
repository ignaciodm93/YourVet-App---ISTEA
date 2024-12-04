import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { VerificacionComponent } from './auth/verificacion/verificacion.component';
import { Pagina404Component } from './shared/pagina404/pagina404.component';
import { SuppliersComponent } from './pages/suppliers/suppliers.component';
import { PagesRoutingModule, pagesRoutes } from './pages/pages-routing.module';
import { EnviadoComponent } from './auth/enviado/enviado.component';
import { ClientComponent } from './pages/client/client.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent }, // Ruta para el componente de inicio de sesión
  { path: 'register', component: RegisterComponent }, // Ruta para el componente de registro
  { path: 'register/enviado',  component: EnviadoComponent},
  { path: 'auth/verificacion/:encri', pathMatch: 'full', component: VerificacionComponent }, // Ruta para el componente de registro
  { path: 'suppliers', component: SuppliersComponent},
  { path: 'client', component: ClientComponent},
  ...pagesRoutes,
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: '**', pathMatch: 'full', component: Pagina404Component }, // Ruta para el componente de registro
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
