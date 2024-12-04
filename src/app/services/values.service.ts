import { Injectable } from '@angular/core';
import { BaseMicroService } from './base.microservice';
import { AppSettings } from 'appsettings-json-reader';
import { PreguntasSeguridad } from '../models/preguntasSeguridad';
import { TipoCodArea } from '../models/tipoCodArea';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ValuesService {

  private readonly URL: string = environment.apiUrl

  constructor(private baseMicroService:BaseMicroService) { }

  async getPreguntas():Promise<PreguntasSeguridad[]>{
    return await this.baseMicroService.http.get(this.URL+"api/ComboBox/TiposPreguntaSeguridad")
    .then((response) => {
      let preguntas:PreguntasSeguridad[]=response.data
      return preguntas
    })
    .catch((error) => {
      return []
    })
  }

  async getCodigosArea():Promise<TipoCodArea[]>{
    return await this.baseMicroService.http.get(this.URL+"api/ComboBox/TiposCodigoArea")
    .then((response) => {
      let codigos:TipoCodArea[]=response.data
      return codigos
    })
    .catch((error) => {
      return []
    })
  }
}
