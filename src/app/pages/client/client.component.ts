import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioLogin } from 'src/app/models/usuarioLogin.model';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {


  constructor(private clientService: ClientService, 
    private router: Router) { }
  ngOnInit (): void {
  }

  public redirect(destination: string): void {
    this.router.navigate(['client/'.concat(destination)]);
  }

}
