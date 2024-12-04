import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';
import { BaseMicroService } from '../services/base.microservice';
import { VerificacionComponent } from './verificacion/verificacion.component';
import { EnviadoComponent } from './enviado/enviado.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerificacionComponent,
    EnviadoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers:[
    BaseMicroService
  ],
  exports:[
    LoginComponent,
    RegisterComponent,
    VerificacionComponent,
    EnviadoComponent
  ]
})
export class AuthModule { }
