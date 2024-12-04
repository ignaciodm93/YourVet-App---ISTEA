import { ActionDto } from "./action.model";
import { PageDto } from "./pageDto.model";

export class Profesional extends PageDto implements ActionDto {
    id: number;
    nombre: string;
    apellido: string;
    especialidad: string;
    tipoDoc: string;
    nroDoc: string;
    fechaNacimiento: string;
    practica: string;
    matricula: string;
    public actions: string[];
    estaActivo: boolean;
    idUsuarioVeterinaria: number;
    idTipoEspecialidad: number;
    idEstablecimiento: number;
    especialidadDescripcion: any;
    edad: number;
    ingreso: string;
    
}