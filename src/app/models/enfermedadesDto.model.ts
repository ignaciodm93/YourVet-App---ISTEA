export class EnfermedadesDto {
    idTipoEnfermedad: number;
    fechaCreacion: Date;
    dolencia: string;
    tratamiento: string;
    observacion: string;

    constructor(id, fc) {
        this.idTipoEnfermedad = id;
        this.fechaCreacion = fc;
    }
}