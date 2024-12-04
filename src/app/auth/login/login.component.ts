import { Component, OnInit } from '@angular/core';
import { ModalService as ModalService } from '../../services/modal-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsuarioLogin } from 'src/app/models/usuarioLogin.model';
import { Router } from '@angular/router';
declare var google: any

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private modalService:ModalService,
              private formBuilder: FormBuilder,
              private authService:AuthService,
              private router:Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  }

  public async onSubmitLogin(){
    // console.log(this.loginForm)
    var credencialesLogin:UsuarioLogin={
      nombreUsuario:this.loginForm.value['username'],
      clave:this.loginForm.value['password'],
      tokenCaptcha:""
    }

    var credenciales=await this.authService.login(credencialesLogin)
    if(credenciales != undefined){
      if(credenciales.esCliente){
        this.router.navigate(['/client/pets'])
      }else{
        this.router.navigate(['/suppliers/shifts'])
      }
    }
    
  }

  public closeModal(){
    this.modalService.$modalLogin.emit(false)
  }
}