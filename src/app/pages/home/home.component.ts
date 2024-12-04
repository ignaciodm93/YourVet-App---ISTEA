import { Component,OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public modalLogin:boolean=false;

  constructor(private modalService:ModalService) { }

  ngOnInit (): void {
    this.modalService.$modalLogin.subscribe((valor)=>this.modalLogin=valor)
    this.modalService.$modalRegister.subscribe((valor)=>this.modalLogin=valor)
  }

}
