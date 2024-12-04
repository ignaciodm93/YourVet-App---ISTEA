import { PageDto } from './pageDto.model';
import { Profesional } from './profesional.model';
import { Turno } from './turno.model';

export class Establecimiento extends PageDto {
  id: number;
  idUsuarioVeterinaria: number;
  idTipoLocalidad: number;
  calle: string;
  numero: string;
  piso: string;
  departamento: string;
  codigoPostal: string;
  direccionCompleta: boolean;
  sucursal: number;
  fechaCreacion: string;
  fechaModificacion: string;
  nombre: string;
  tipoLocalidadDescripcion: string;
  estaActivo: boolean;
  idSucursal: any;
}