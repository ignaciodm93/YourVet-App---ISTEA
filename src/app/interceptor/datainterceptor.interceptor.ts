import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from '../shared/loading/loading.service';

@Injectable()
export class DatainterceptorInterceptor implements HttpInterceptor {

  constructor( private readonly loadingservice:LoadingService) {}
  private activeRequest=0

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      
    if(this.activeRequest=== 0){
      this.loadingservice.show()

    }
    this.activeRequest++

    return next.handle(request).pipe(
      finalize(()=> this.stopLoader())
    )
   

  }

  private stopLoader(){
    this.activeRequest--
    if(this.activeRequest===0){
      this.loadingservice.hide()
    }

  }

}
