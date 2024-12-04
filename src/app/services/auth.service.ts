import { Injectable } from '@angular/core';
import { UsuarioLogin } from '../models/usuarioLogin.model';
import { UsuarioRegistro } from '../models/usuarioRegistro.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseMicroService } from './base.microservice';
import { AppSettings } from 'appsettings-json-reader';
import { UsuarioCredenciales } from '../models/usuarioCredenciales.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private readonly URL: string = 'http://localhost:5291/'
  private readonly URL: string = environment.apiUrl
  private usuarioCredenciales: UsuarioCredenciales

  constructor(private baseMicroService: BaseMicroService,
    private router: Router) { }


  public async login(credencialesLogin: UsuarioLogin): Promise<UsuarioCredenciales> {

    return await this.baseMicroService.http.post(this.URL + 'api/Usuario/Ingresar', credencialesLogin /*,{ headers: { Authorization: `bearer ${this.AUTH}` } }*/)
      .then((response) => {
        if (response.status == 200) {
          var credenciales: UsuarioCredenciales = {
            ...response.data
          }

          sessionStorage.setItem('token', credenciales.token)
          sessionStorage.setItem('credenciales', btoa(JSON.stringify(credenciales)))
          this.usuarioCredenciales = credenciales
          return credenciales
        }
        return undefined
      })
      .catch((error) => {
        console.log(error)
        return undefined
      })
  }

  public async register(credencialesRegistro: UsuarioRegistro): Promise<boolean> {
    return await this.baseMicroService.http.post(this.URL + 'api/Usuario/CrearUsuario', credencialesRegistro /*,{ headers: { Authorization: `bearer ${this.AUTH}` } }*/)
      .then((response) => {
        if (response.status == 200) {
          return true
        }
        return false
      })
      .catch((error) => {
        return false
        console.log(error)
      })
  }

  public async validarEmail(encriptacion: string) {
    const variableCodificada = encodeURIComponent(encriptacion);

    const apiEndpoint = this.URL+`api/Usuario/ValidarVerificacionMailUsuario?encriptacion=${variableCodificada}`;

    await this.baseMicroService.http.put(apiEndpoint /*,{ headers: { Authorization: `bearer ${this.AUTH}` } }*/)
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  public getUsuarioCredenciales(): UsuarioCredenciales {

    var credenciales:UsuarioCredenciales = JSON.parse(atob(sessionStorage.getItem('credenciales')))
    if (!credenciales) {
      this.logoutSession()
    }
    return credenciales;
  }

  public logoutSession() {
    sessionStorage.clear()
    this.router.navigate(["/home"])
  }
}
