import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioRegistro } from 'src/app/models/usuarioRegistro.model';

@Component({
  selector: 'app-enviado',
  templateUrl: './enviado.component.html',
  styleUrls: ['./enviado.component.css']
})
export class EnviadoComponent implements OnInit {
  credenciales:UsuarioRegistro
  
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

}
