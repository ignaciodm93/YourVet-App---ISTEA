import { AntiparasitarioDto } from "./antiparasitarioDto.model";
import { EnfermedadesDto } from "./enfermedadesDto.model";
import { PracticaDto } from "./practicaDto.model";
import { VacunaDto } from "./vacunaDto.model";

export class HistorialClinico {
    id: number;
    idTurno: number;
    observaciones: string;
    fechaEmision: Date;
    fechaModificacion: Date;
    historialClinicoEnfermedadesYDolencias: EnfermedadesDto[];
    historialClinicoTipoPracticas: PracticaDto[];
    historialClinicoTipoVacunas: VacunaDto[];
    historialClinicoTipoAntiparasitarios: AntiparasitarioDto[];

    constructor() {
        this.historialClinicoTipoPracticas = [];
        this.historialClinicoEnfermedadesYDolencias = [];
        this.historialClinicoTipoVacunas = [];
        this.historialClinicoTipoAntiparasitarios = [];
    }
}