export class VacunaDto {
    idTipoVacuna: number;
    fechaAplicacion: Date;
    fechaVencimiento: Date;

    constructor(id, ap, vto) {
        this.idTipoVacuna = id;
        this.fechaAplicacion = ap;
        this.fechaVencimiento = vto;
    }
}