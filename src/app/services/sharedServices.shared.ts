import { Injectable } from '@angular/core';
import { AppSettings } from 'appsettings-json-reader';
import { BaseMicroService } from './base.microservice';
import { BehaviorSubject, Observable, Subject, catchError, last, map, of } from 'rxjs';
import { Establecimiento } from '../models/sucursal.model';
import { HttpParams } from '@angular/common/http';
import { convertirAParametros } from '../pages/Utils/utils';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedServices {

  private extraText: Subject<string> = new Subject<string>();
  extraText$: Observable<string> = this.extraText.asObservable();
  constructor(private baseMicroService: BaseMicroService, private httpParams: HttpParams, private authService: AuthService) { }

  private readonly URL: string = environment.apiUrl;

  public obtenerPacientePorId1(id: string): Promise<any> {
    return this.baseMicroService.http.get(this.URL + "api/Paciente/ObetenerPacientePorId?idPaciente=" + id, { headers: { Authorization: `bearer ${this.token}` } })
      .then((response) => {
        debugger;
      })
      .catch((error) => {
        return []
      })
  }

  private notifications: Subject<null> = new Subject<null>();
  notifications$: Observable<null> = this.notifications.asObservable();

  token: string = sessionStorage.getItem('token')

  public obtenerPacientePorId(id: string): Promise<any> {
    return this.baseMicroService.http.get(this.URL + "api/Paciente/ObetenerPacientePorId?idPaciente=" + id, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public getProvincias(): Promise<any> {
    return this.baseMicroService.http.get(this.URL + "api/ComboBox/TiposProvincia", { headers: { Authorization: `bearer ${this.token}` } }).then();
  }


  public getLocalidades(): Promise<any> {
    return this.baseMicroService.http.get(this.URL + "api/ComboBox/TiposLocalidad", { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public getEstadosConsulta(): Promise<any> {
    return this.baseMicroService.http.get(this.URL + "api/ComboBox/TiposEstadoConsulta", { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public getEnfermedades(): Promise<any> {
    return this.baseMicroService.http.get(this.URL + "api/ComboBox/TiposEnfermedad", { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public getDocumentos(): Promise<any> {
    return this.baseMicroService.http.get(this.URL + "api/ComboBox/TiposDocumento", { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public getAntiparasitarios(): Promise<any> {
    return this.baseMicroService.http.get(this.URL + "api/ComboBox/TiposAntiparasitario", { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public getPracticas(): Promise<any> {
    return this.baseMicroService.http.get(this.URL + "api/ComboBox/TiposPractica", { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public getCodigosArea(): Promise<any> {
    return this.baseMicroService.http.get(this.URL + "api/ComboBox/TiposCodigoArea", { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public getVacunas(): Promise<any> {
    return this.baseMicroService.http.get(this.URL + "api/ComboBox/TiposVacuna", { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public getCalificacion(): Promise<any> {
    return this.baseMicroService.http.get(this.URL + "api/ComboBox/TiposCalificacion", { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public getEspecialidad(): Promise<any> {
    return this.baseMicroService.http.get(this.URL + "api/ComboBox/TiposEspecialidad", { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public getRaza(): Promise<any> {
    return this.baseMicroService.http.get(this.URL + "api/ComboBox/TiposRaza", { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public getSexo(): Promise<any> {
    return this.baseMicroService.http.get(this.URL + "api/ComboBox/TiposSexo", { headers: { Authorization: `bearer ${this.token}` } }).then();
  }
  public getTipoanimal(): Promise<any> {
    return this.baseMicroService.http.get(this.URL + "api/ComboBox/TiposAnimal", { headers: { Authorization: `bearer ${this.token}` } }).then();
  }
  public getTipoAnimalPorTipoRaza(id): Promise<any> {
    return this.baseMicroService.http.get(this.URL + "api/ComboBox/TipoAnimalPorTipoRaza?idTipoAnimal=" + id, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public obtenerTurnos(req): Promise<any> {
    return this.baseMicroService.http.get(this.URL + "api/Turno/ObtenerTurnos?" + convertirAParametros(req), { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public crearTurno(req): Promise<any> {
    return this.baseMicroService.http.post(this.URL + "api/Turno/crearTurno", req, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public obtenerTurnoPorId(id): Promise<any> {
    return this.baseMicroService.http.get(this.URL + "api/Turno/ObtenerTurnoPorId=" + id, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public cambioEstadoTurno(id): Promise<any> {
    return this.baseMicroService.http.put(this.URL + "api/Turno/cambioEstadoTurno=" + id, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public actualizarTurno(req): Promise<any> {
    return this.baseMicroService.http.put(this.URL + "api/Turno/actualizarTurno", req, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public finalizarTurno(req): Promise<any> {
    return this.baseMicroService.http.put(this.URL + "api/Turno/finalizarTurno", req, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public updateText(data): void {
    this.extraText.next(data);
  }

  public getExtraText() {
    this.extraText.pipe(last()).subscribe((ultimoValor) => {
      return ultimoValor;
    });
  }

  public obtenerEspecialistaPorId(id): Promise<any> {
    return this.baseMicroService.http.get(this.URL + "api/Especialista/ObetenerEspecialistaPorId?idEspecialista=" + id, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public updateNotifications(): void {
    this.notifications.next(null);
  }

  public marcarComoVista(id): Promise<any> {
    return this.baseMicroService.http.put(this.URL + "api/Notificacion/ActualizarEstadoNotificacion?idNotificacion=" + id, {}, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }
}


