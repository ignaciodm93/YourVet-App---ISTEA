import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private modalService:ModalService,
              private readonly router:Router) { }
  ngOnInit(): void {
  }

  public openModalLogin(){
    this.modalService.$modalLogin.emit(true)
  }

  public redirectToRegister(){
  }


}
