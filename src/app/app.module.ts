import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpHandler, HttpParams } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';

import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
// import { SocialLoginModule} from '@abacritt/angularx-social-login';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DatainterceptorInterceptor } from './interceptor/datainterceptor.interceptor';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    // SocialLoginModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FullCalendarModule
  ],
  providers: [HttpClientModule, HttpClient, DatePipe,{provide:HTTP_INTERCEPTORS,useClass:DatainterceptorInterceptor,multi:true}, HttpParams],
  bootstrap: [AppComponent],
  exports: [FullCalendarModule]
})
export class AppModule { }
