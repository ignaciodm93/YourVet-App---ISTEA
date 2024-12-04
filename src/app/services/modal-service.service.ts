import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  $modalLogin = new EventEmitter<boolean>()
  $modalRegister = new EventEmitter<boolean>()
  
  constructor() { }
  
}
