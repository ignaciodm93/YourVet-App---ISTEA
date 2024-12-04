import { ActionDto } from './action.model';
import { PageDto } from './pageDto.model';

export class Turno extends PageDto implements ActionDto {
    public actions: string[];

    //crear turno
    idPaciente: number;
    idEspecialista: number;
    fechaCreacion: Date;
    fechaTurno: Date;
    
    //obtener turno por id, cambio estado turno, 
    id: number;

    nombrePaciente: string;
    nombreEspecialista: string;
    idEstadoConsulta: number;
    estadoConsultaDescripcion: string;
    turnoAceptado: boolean;
    respuestaTurno: string;
  
    //obtenerTurnos
    idUsuario: number;

    estadoConsulta: string;
    idTurno: number;
    nombreUsuario: string;
}