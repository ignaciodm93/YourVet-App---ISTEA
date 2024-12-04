import { Mascota } from './mascota.model';
import { Profesional } from './profesional.model';
import { Establecimiento } from './sucursal.model';
import { Turno } from './turno.model';

export class Veterinaria {
    nombre: string;
    email: string;
    profesionales: Array<Profesional>;
    sucursales: Array<Establecimiento>;
    turnos: Array<Turno>;
    mascotas: Array<Mascota>;
    fechaRegistro: string;
    doc: string;
    idTipoDoc: string;
    id: number;
    nombreUsuario: string;
    telefono: string;
    documentoDescripcion: string;
    fechaUltimoLogin: any;
    nombreVet: string;
    nrodoc: any;
    fotoPerfilBase64: string;
}