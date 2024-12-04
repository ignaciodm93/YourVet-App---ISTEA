import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Mascota } from '../models/mascota.model';
import { environment } from 'src/environments/environment';
import { Proveedor } from '../models/proveedor.model';
import { UsuarioLogin } from '../models/usuarioLogin.model';
import { AuthService } from './auth.service';
import { AppSettings } from 'appsettings-json-reader';
import { BaseMicroService } from './base.microservice';
import { convertirAParametros } from '../pages/Utils/utils';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  // private readonly API=environment.api
  constructor(private readonly http: HttpClient, private authServices: AuthService, private bm: BaseMicroService) { }
  private readonly URL: string = environment.apiUrl
  token: string = sessionStorage.getItem('token');


  getpacientes(nombre: string): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.URL + 'api/Paciente/ObtenerPacientesPorUsuarioCliente?nombreUsuario=' + nombre, { headers: { Authorization: `bearer ${this.token}` } })
  }


  private myPets: Subject<any> = new Subject<string>();
  myPets$: Observable<any> = this.myPets.asObservable();

  public updateMyPets(dat): void {
    this.myPets.next(dat);
  }



  /**
  getid(id:number):Observable<Mascota>{
    return this.http.get<Mascota>(`${this.API}/${id}`) 
   }
   
  add(modelo:Mascota):Observable<Mascota>{
  return this.http.post<Mascota>(this.API,modelo)
  }
   
  update(modelo:Mascota):Observable<void>{
    const body={
      //image:modelo.image,
      id:modelo.id,
      name:modelo.nombre,
      raza:modelo.idTipoAnimalTipoRaza,
      color:modelo.color,
      genero:modelo.idSexo,
      fechanacimiento:modelo.fechaNacimiento,
      esterilizado:modelo.estaCastrado,
      chiprastreo:modelo.chipRastreo,
      activo:modelo.estaActivo,
  
    }
    console.log(modelo)
    return this.http.put<void>(`${this.API}/${modelo.id}`,body) 
  
  }
  
  delete(idmascota:number):Observable<void>{
  return this.http.delete<void>(`${this.API}/${idmascota}`) ;
  
  }
  
  
  /*************************************************************************
  getTipoRaza():Observable<string[]>{
    return this.http.get<string[]>(this.API+"api/ComboBox/TiposRaza")
  }
  ****/
  /******************************************************************************/
  crearPaciente(modelo: any): Promise<any> {
    return this.bm.http.post(this.URL + "api/Paciente/CrearPaciente", modelo, { headers: { Authorization: `bearer ${this.token}` } })

  }

  /******************************************************************************/
  addCreate(modelo: any): Observable<any> {
    return this.http.post<any>(this.URL + 'api/Paciente/CrearPaciente', modelo, { headers: { Authorization: `bearer ${this.token}` } })
  }

  public ObtenerUsuariosVeterinarias(req): Promise<any> {
    return this.bm.http.get(this.URL + `api/Usuario/ObtenerUsuariosVeterinarias?${convertirAParametros(req)}`, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public buscarMascotas(idCliente): Promise<any> {
    return this.bm.http.get(this.URL + "api/Paciente/ObtenerPacientesPorIdUsuarioCliente?idUsuarioCliente=" + idCliente, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public buscarTurnosPorIdMascota(req): Promise<any> {
    return this.bm.http.get(this.URL + `api/Turno/ObtenerTurnos?${convertirAParametros(req)}`, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public cambiarEstadoPacienteId(id): Promise<any> {
    return this.bm.http.put(this.URL + "api/Paciente/CambiarEstadoPacienteId?idPaciente=" + id, {} , { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public obtenerPacientePorId(id): Promise<any> {
    return this.bm.http.get(this.URL +"api/Paciente/ObtenerPacientePorId?idPaciente=" + id, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public actualizarPaciente(m): Promise<any> {
    return this.bm.http.put(this.URL + "api/Paciente/ActualizarPaciente", m, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public print(id, name): Promise<any> {
    const url = `${this.URL}api/HistorialClinico/GenerarReportePorIdhistorialClinico?idHistorialClinico=${id}`;
  
    return this.bm.http.get(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      responseType: 'blob',
    }).then(response => {
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.download = this.buildFileName(name);
      document.body.appendChild(link);
      link.click();
  
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('Error al descargar el PDF', error);
    });
  }

  private buildFileName(nombreMascota: string): string {
    const fechaActual = new Date();
    const fechaFormateada = `${fechaActual.getDate()}-${fechaActual.getMonth() + 1}-${fechaActual.getFullYear()}_${fechaActual.getHours()}-${fechaActual.getMinutes()}`;
    const fileName = `YourVet - Historial Clínico - ${nombreMascota} - ${fechaFormateada}.pdf`;
    return fileName;
  }

  public async notificacionesCli(req): Promise<any> {
    let reqString = convertirAParametros(req);
    return await this.bm.http.get(this.URL + `api/Notificacion/ObtenerNotificacionesUsuarioCliente?${reqString}`, {headers: {Authorization: `bearer ${this.token}`}}).then();
  }



  public obtenerUsuarioClientePorId(id): Promise<any> {
    return this.bm.http.get(this.URL +"api/Usuario/ObtenerUsuarioClientePorId?idUsuarioCliente="  + id, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }


  public actualizarUsuarioCliente(modelo): Promise<any> {
    return this.bm.http.put(this.URL + "api/Usuario/ActualizarUsuarioCliente", modelo, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }



}
