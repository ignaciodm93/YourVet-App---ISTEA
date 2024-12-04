import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseMicroService } from './base.microservice';
import { AppSettings } from 'appsettings-json-reader';
import { Establecimiento } from '../models/sucursal.model';
import { convertirAParametros } from '../pages/Utils/utils';
import { RespuestaGraficoLineal, RespuestaGraficos } from '../models/RespuestaGraficos.model';
import { environment } from 'src/environments/environment';
import { RespuestaKpis } from '../models/RespuestaKpis.model';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  private readonly URL: string = environment.apiUrl;
  token: string = sessionStorage.getItem('token');

  constructor(private httpClient: HttpClient, private bm: BaseMicroService) { }

  public getShifts(endpoint: string): Observable<any> {
    return this.httpClient.get('endpoint');
  }

  public getVets(endpoint: string): Observable<any> {
    return this.httpClient.get('endpoint');
  }

  public getMedicalHistory(endpoint: string): Observable<any> {
    return this.httpClient.get('endpoint');
  }

  public getVetProfileData(name: string): Observable<any> {
    return this.httpClient.get('endpoint');
  }

  model = [{
    "id": 0,
    "idUsuarioVeterinaria": 4,
    "idTipoLocalidad": 1,
    "calle": "blanco encalada",
    "numero": "4523",
    "piso": "B",
    "departamento": "Belgrano",
    "codigoPostal": "1431",
    "direccionCompleta": true,
    "sucursal": 0,
    "fechaCreacion": "2023-11-08T23:48:45.835Z",
    "fechaModificacion": "2023-11-08T23:48:45.835Z"
  }];

  public crearEstablecimiento(establecimiento: Establecimiento): Promise<any> {
    return this.bm.http.post(this.URL + "api/Establecimiento/CrearEstablecimiento", establecimiento, { headers: { Authorization: `bearer ${this.token}` } });
  }

  public obtenerEstablecimientoPorId(id: string): Promise<any> {
    return this.bm.http.get(this.URL + "api/Establecimiento/ObtenerEstablecimientoPorId?idEstablecimiento=" + id, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }


  public actualizarEstablecimiento(establecimiento: Establecimiento) {
    return this.bm.http.put(this.URL + "api/Establecimiento/ActualizarEstablecimiento", convertirAParametros(establecimiento), { headers: { Authorization: `bearer ${this.token}` } })
      .then((response) => {
        debugger;
      })
      .catch((error) => {
        return []
      })
  }

  public cambioEstadoEstablecimiento(idEstablecimiento: string) {
    return this.bm.http.put(this.URL + "api/Establecimiento/CambioEstadoEstablecimiento?idEstablecimiento=" + idEstablecimiento, {}, { headers: { Authorization: `bearer ${this.token}` } })
      .then((response) => {
      })
      .catch((error) => {
      })
  }

  public obtenerEstablecimientosPaginados(request): Promise<any> {
    let reqString = convertirAParametros(request);
    return this.bm.http.get(this.URL + `api/Establecimiento/obtenerEstablecimientosPaginados?${reqString}`, { headers: { Authorization: `bearer ${this.token}` } }).then().catch();
  }

  public crearEspecialista(req): Promise<any> {
    return this.bm.http.post(this.URL + "api/Especialista/CrearEspecialista?", req, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public obtenerEspecialistasPorIdEstablecimiento(idEstablecimiento): Promise<any> {
    return this.bm.http.get(this.URL + "api/Especialista/ObtenerEspecialistasPorIdEstablecimiento?idEstablecimiento=" + idEstablecimiento, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }


  public obtenerPacientesPorUsuarioCliente(nombre): Promise<any> {
    return this.bm.http.get(this.URL + "api/Paciente/ObtenerPacientesPorUsuarioCliente?nombreUsuario=" + nombre, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public obtenerPacientesPorIdUsuarioCliente(id): Promise<any> {
    return this.bm.http.get(this.URL + "api/Paciente/ObtenerPacientesPorIdUsuarioCliente?idUsuarioCliente=" + id, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }


  public actualizarInfoVeterinaria(request) {
    return this.bm.http.put(this.URL + "api/Usuario/ActualizarUsuarioVeterinaria", request, { headers: { Authorization: `bearer ${this.token}` } });
  }

  public obtenerDatosMiVeterinaria(id): Promise<any> {
    return this.bm.http.get(this.URL + "api/Usuario/ObtenerUsuarioVeterinariaPorId?idUsuaruiVEterinaria=" + id, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public obtenerDatosGraficoLinea(): Promise<RespuestaGraficoLineal[]> {
    return this.bm.http.get(this.URL + "api/Dashboard/ObtenerGraficoDeBarrasPorVeterinaria", { headers: { Authorization: `bearer ${this.token}` } })
      .then((resp) => {
        var respuesta: RespuestaGraficoLineal = {
          name: 'Cantidad de Atenciones',
          series: resp.data
        }
        var respuestalista: RespuestaGraficoLineal[] = []
        respuestalista.push(respuesta)
        return respuestalista
      })
      .catch((error) => {
        return null
        console.log(error)
      })
  }
  public obtenerDatosGraficoTorta(): Promise<RespuestaGraficos> {
    return this.bm.http.get(this.URL + "api/Dashboard/ObtenerGraficoDeTortaPorVeterinaria", { headers: { Authorization: `bearer ${this.token}` } })
      .then((resp) => {
        var respuesta: RespuestaGraficos[] = resp.data
        return respuesta
      })
      .catch((error) => {
        return null
        console.log(error)
      })
  }
  public obtenerDatosKpis(): Promise<RespuestaKpis> {
    return this.bm.http.get(this.URL + "api/Dashboard/ObtenerKpisPorVeterinaria", { headers: { Authorization: `bearer ${this.token}` } })
      .then((resp) => {
        var respuesta: RespuestaKpis = resp.data
        return respuesta
      })
      .catch((error) => {
        return null
        console.log(error)
      })
  }

  public crearHistorialClinico(data): Promise<any> {
    return this.bm.http.post(this.URL + "api/HistorialClinico/crearHistorialClinico", data, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public async obtenerHCporUV(req): Promise<any> {
    let reqString = convertirAParametros(req);
    return await this.bm.http.get(this.URL + `api/HistorialClinico/ObtenerHistorialesClinicosUsuarioVeterinaria?${reqString}`, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public async obtenerHCporUC(req): Promise<any> {
    let reqString = convertirAParametros(req);
    return await this.bm.http.get(this.URL + `api/HistorialClinico/ObtenerHistorialesClinicosUsuarioCliente?${reqString}`, { headers: { Authorization: `bearer ${this.token}` } }).then();
  }

  public async notificacionesVet(req): Promise<any> {
    let reqString = convertirAParametros(req);
    return await this.bm.http.get(this.URL + `api/Notificacion/ObtenerNotificacionesUsuarioVeterinaria?${reqString}`, {headers: {Authorization: `bearer ${this.token}`}}).then();
  }
}
