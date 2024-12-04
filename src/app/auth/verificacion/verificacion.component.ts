import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.css']
})
export class VerificacionComponent implements OnInit {


  constructor(private rutaActiva: ActivatedRoute,
              private readonly authService:AuthService,
              private router:Router) { }

  ngOnInit(): void {
     var encriptacion = this.rutaActiva.snapshot.params['encri']
     this.authService.validarEmail(encriptacion)
  }

  volverHome(){
    this.router.navigate(['/home'])
  }

}
