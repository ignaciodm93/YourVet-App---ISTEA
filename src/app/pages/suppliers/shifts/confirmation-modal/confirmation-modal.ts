import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AntiparasitarioDto } from 'src/app/models/antiparasitarioDto.model';
import { EnfermedadesDto } from 'src/app/models/enfermedadesDto.model';
import { HistorialClinico } from 'src/app/models/historialClinico.model';
import { PracticaDto } from 'src/app/models/practicaDto.model';
import { VacunaDto } from 'src/app/models/vacunaDto.model';
import { isNotNullAndNotUndefined } from 'src/app/pages/Utils/utils';
import { SharedServices } from 'src/app/services/sharedServices.shared';

@Component({
    selector: 'confirmation-modal',
    templateUrl: './confirmation-modal.component.html',
    styleUrls: ['./confirmation-modal.css']
})
export class ConfirmationModalComponent implements OnInit {

    @Input()
    public showModal: boolean = false;
    @Input()
    public modalTitle: string;
    @Input()
    public cancelTxt: string;
    @Input()
    public confirmTxt: string;
    @Input()
    public modalSubtitle: string;
    @Input()
    public modalTxt: string;
    @Output()
    public onConfirm = new EventEmitter<void>;
    @Input()
    public arrayList: string[];
    @Input()
    public hasFirstBtn: boolean = true;
    @Input()
    public hasSecondBtn: boolean = true;
    @Input()
    public actionFsTxt: string;
    @Input()
    public actionScTxt: string;
    @Output()
    public onAction = new EventEmitter<string>;
    @Input()
    public showInputText = false;
    @Input()
    public isSuccessDisabled = false;
    @Output()
    public onActionComplete = new EventEmitter<{}>;
    
    vacunasAplicadas: any[] = [];
    practicasAplicadas: any[] = [];
    antiparasitariosAplicados: any[] = [];
    enfermedadesAplicadas: any[] = [];
    historialClinico: HistorialClinico = new HistorialClinico();

    @Input()
    enfermedadesList: any[] = [];

    @Input()
    vacunasList: any[];

    @Input()
    practicasList: any[];

    @Input()
    antiparasitariosList: any[];
  

    mostrarCartel: boolean = false;

    constructor(private snackBar: MatSnackBar, private sharedServices: SharedServices, private changeRef: ChangeDetectorRef) { }

    ngOnInit(): void { }

    public close(): void {
        this.mostrarCartel = false;
        this.cleanMe();
    }

    private cleanMe(): void {
      this.vacunasAplicadas = [];
      this.practicasAplicadas = [];
      this.antiparasitariosAplicados = [];
      this.enfermedadesAplicadas= [];
      this.historialClinico = new HistorialClinico();
      this.vacunasTableData = [];
      this.antiparasitarioTableData = [];
      this.practicasTableData = [];
      this.enfermedadesTableData = [];
      this.hasAntiparasitariosSeleccionadosData = false;
      this.hasPracticasSeleccionadasData = false;
      this.hasVacunasSeleccionadasData = false;
      this.hasEnfermedadesSeleccionadasData = false;
      let txt = document.getElementById("descripcion") as HTMLInputElement;
      txt.value = "";
      txt.textContent = "";
      (document.getElementById("descripcion") as HTMLInputElement).value = null;
      txt.setAttribute("value", "");
      this.currentTXT = null;
      this.changeRef.detectChanges();
    }

    currentTXT;

    public show(): void {
        this.mostrarCartel = true;
    }

    public confirm(): void {
        this.close();
        this.onConfirm.emit();
    }

    public action(action: string): void {
        this.close();
        this.showInputText = false;
        this.onAction.emit(action);
        this.eraseMsg();
    }

    public chequearInput(texto): void {
        if(isNotNullAndNotUndefined(texto.target.value) && texto.target.value.length > 5) {
            this.isSuccessDisabled = false;
            this.feedbackTxt = texto.target.value;
        } else {
            this.isSuccessDisabled = true;
        }
    }

    private feedbackTxt: string = "";

    public actionComplete(data): void {
      this.showInputText = false;
      let obj = {};
        obj['descripcion'] = this.feedbackTxt;
        obj['action'] = "Completar";
        obj['dto'] = this.historialClinico;
        this.onActionComplete.emit(obj);
        this.eraseMsg();
        this.close();
    }

    private eraseMsg(): void {
        if(isNotNullAndNotUndefined((document.getElementById("descripcion") as HTMLInputElement).value)) {
            (document.getElementById("descripcion") as HTMLInputElement).value = "";
        }
    }

    @Input()
    set setInputText(value) {
        this.showInputText = value;
        this.changeRef.detectChanges();
    }

    public agregarVacuna(val): void {
        this.vacunasAplicadas.push(val);
    }

    public agregarPractica(val): void {
        this.practicasAplicadas.push(val);
    }

    public agregarAntiparasitario(val): void {
        this.antiparasitariosAplicados.push(val);
    }

    public agregarEnfermedad(e): void {
        this.enfermedadesAplicadas.push(e);
    }

    private setChecks(obj): void {
        if(this.antiparasitariosAplicados.length > 0) {
            obj['antiparasitarios'] = [];
            this.antiparasitariosAplicados.forEach(element => {
                obj['antiparasitarios'].push(element);
            });
        }
        if(this.practicasAplicadas.length > 0) {
            obj['practicas'] = [];
            this.practicasAplicadas.forEach(element => {
                obj['practicas'].push(element);
            });
        }
        if(this.vacunasAplicadas.length > 0) {
            obj['vacunas'] = [];
            this.vacunasAplicadas.forEach(element => {
                obj['vacunas'].push(element);
            });
        }
    }

    public removeSelectedPractica(p): void {
        this.practicasAplicadas = this.practicasAplicadas.filter(pp => pp.id != p.id);
        this.updatePra(p.id);
    }
    public removeSelectedAntiparasitario(a): void {
        this.antiparasitariosAplicados = this.antiparasitariosAplicados.filter(ap => ap.id != a.id);
        this.updateAnt(a.id);
    }
    public removeSelectedVacuna(v): void {
        this.vacunasAplicadas = this.vacunasAplicadas.filter(vv => vv.id != v.id);
        this.updateVac(v.id);
    }
    public removeSelectedEnfermedad(e): void {
        this.enfermedadesAplicadas = this.enfermedadesAplicadas.filter(ee => ee.id != e.id);
        this.updateEnf(e.id);
    }

    vacunasQL = [];

    @ViewChild('vac') vacs!: MatSelect;
    @ViewChild('enfs') enfs!: MatSelect;
    @ViewChild('pras') pras!: MatSelect;
    @ViewChild('ants') ants!: MatSelect;


    public updateVac(removed): void {
        this.vacs.options.map(o => this.deselect(o, removed));
        this.changeRef.detectChanges();
    }

    public updatePra(removed): void {
        this.pras.options.map(o => this.deselect(o, removed));
        this.changeRef.detectChanges();
    }

    public updateEnf(removed): void {
        this.enfs.options.map(o => this.deselect(o, removed));
        this.changeRef.detectChanges();
    }

    public updateAnt(removed): void {
        this.ants.options.map(o => this.deselect(o, removed));
        this.changeRef.detectChanges();
    }

    private deselect(o, removed): void {
        if (o.value == removed) {
            o.deselect();
        }
    }

    //enfermedades y dolencias
   selectedEnfermedad: string;
  enfermedadesTableData: EnfermedadesRow[] = [];
  hasEnfermedadesSeleccionadasData: boolean = false;

  onEnferemedadSelected() {
    if(!this.enfermedadesAplicadas.includes(this.selectedEnfermedad)) {
        this.addRowToTableEnfermedades();
        this.selectedEnfermedad = null;
    } else {
        this.callToast("La enfermedad ya se encuentra seleccionada", 3000, "infoToast");
    }
  }

  addRowToTableEnfermedades() {
    let row = new EnfermedadesRow(this.enfermedadesList.find(e => e.id == this.selectedEnfermedad).descripcion, '', '', '', this.selectedEnfermedad);
    this.enfermedadesTableData.push(row);
    this.changeRef.detectChanges();
    this.hasEnfermedadesSeleccionadasData = true;
    this.enfermedadesAplicadas.push(this.selectedEnfermedad);
    this.historialClinico.historialClinicoEnfermedadesYDolencias.push(new EnfermedadesDto(this.selectedEnfermedad, new Date()));
    // this.isEnfermedadDropdownDisabled = true;
  }

  public removeEnfermedad(enf): void {
    let aux = this.enfermedadesAplicadas;
    this.enfermedadesAplicadas = aux.filter(e => e.id != enf);
    this.enfermedadesTableData = aux.filter(e => e.descripcion != enf);
    this.historialClinico.historialClinicoEnfermedadesYDolencias = this.historialClinico.historialClinicoEnfermedadesYDolencias.filter(i => i.idTipoEnfermedad != parseInt(this.selectedEnfermedad));
    this.callToast("Se removió la enfermedad " + enf + ".", 3000, "okToast");
    if(this.enfermedadesTableData.length == 0 ) {
        this.hasEnfermedadesSeleccionadasData = false;
    }
  }

  public callToast(text, duration, status): void {
    this.snackBar.open(text, null, {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: status
    });
    setTimeout(() => {
      this.snackBar.dismiss();
    }, duration);
  }

  //antiparasitarios
  selectedAntiparasitario: string;
  antiparasitarioTableData: AntiparasitariosRow[] = [];
  hasAntiparasitariosSeleccionadosData: boolean = false;

  onAntiparasitarioSelected() {
    if(!this.antiparasitariosAplicados.includes(this.selectedAntiparasitario)) {
        this.addRowToTableAntiparasitario();
        this.selectedAntiparasitario = null;
    } else {
        this.callToast("El antiparasitario ya se encuentra agregado.", 3000, "infoToast");
    }
}

  addRowToTableAntiparasitario() {
    let row = new AntiparasitariosRow(this.antiparasitariosList.find(e => e.id == this.selectedAntiparasitario).descripcion, '', this.selectedAntiparasitario);
    this.antiparasitarioTableData.push(row);
    this.changeRef.detectChanges();
    this.hasAntiparasitariosSeleccionadosData = true;
    this.antiparasitariosAplicados.push(this.selectedAntiparasitario);
    this.isAntiparasitarioDropdownDisabled = true;
    let ant = new AntiparasitarioDto();
    ant.idTipoAntiparasitario = parseInt(this.selectedAntiparasitario);
    ant.fechaAplicacion = new Date();
    this.historialClinico.historialClinicoTipoAntiparasitarios.push(ant);
  }

  public removeAntiparasitario(enf): void {
    let aux = this.antiparasitariosAplicados;
    this.antiparasitariosAplicados = aux.filter(e => e != enf);
    this.antiparasitarioTableData = aux.filter(e => e != enf);
    this.callToast("Se removió el antiparasitario " + this.antiparasitariosList.find(a => a.id == enf).descripcion + ".", 3000, "okToast");
    this.historialClinico.historialClinicoTipoAntiparasitarios = this.historialClinico.historialClinicoTipoAntiparasitarios.filter(i => i.idTipoAntiparasitario != enf);
    if(this.antiparasitarioTableData.length == 0 ) {
        this.hasAntiparasitariosSeleccionadosData = false;
    }
    this.isAntiparasitarioDropdownDisabled = false;
  }

  fechaVtoAntiparasitario: Date;


  //practicas
  selectedPractica: string;
  practicasTableData: PracticaRow[] = [];
  hasPracticasSeleccionadasData: boolean = false;

  onPracticaSelected() {
    if(!this.practicasAplicadas.includes(this.selectedPractica)) {
    this.addRowToTablePractica();
    this.selectedPractica = null;
    } else {
        this.callToast("La practica ya se encuentra agregada.", 3000, "infoToast");
    }
  }

  addRowToTablePractica() {
    let row = new PracticaRow(this.practicasList.find(e => e.id == this.selectedPractica).descripcion, '', this.selectedPractica);
    this.practicasTableData.push(row);
    this.changeRef.detectChanges();
    this.hasPracticasSeleccionadasData = true;
    this.practicasAplicadas.push(this.selectedPractica);
    let practica = new PracticaDto();
    practica.idTipoPractica = parseInt(this.selectedPractica);
    practica.fechaAplicacion = new Date();
    this.isPracticaDropdownDisabled = true;
    this.historialClinico.historialClinicoTipoPracticas.push(practica);
  }

  public removePractica(enf): void {
    let aux = this.practicasAplicadas;
    this.practicasAplicadas = aux.filter(e => e != enf);
    this.practicasTableData = aux.filter(e => e != enf);
    this.callToast("Se removió la práctica.", 3000, "okToast");
    this.historialClinico.historialClinicoTipoPracticas = this.historialClinico.historialClinicoTipoPracticas.filter(i => i.idTipoPractica != parseInt(enf));
    if(this.practicasTableData.length == 0 ) {
        this.hasPracticasSeleccionadasData = false;
        this.changeRef.detectChanges();
    }
    this.practicasTableData = []
    this.historialClinico.historialClinicoTipoPracticas.forEach(e => {
      this.practicasTableData.push(new PracticaRow(this.practicasList.find(p => p.id == e.idTipoPractica).descripcion, e.fechaVencimiento, e.idTipoPractica));
    });
    this.isPracticaDropdownDisabled = false;
  }

  fechaVtoPractica: Date;

  //vacunas
  selectedVacuna: string;
  vacunasTableData: VacunaRow[] = [];
  hasVacunasSeleccionadasData: boolean = false;

  onVacunaSelected(dat) {
    if(!this.vacunasAplicadas.includes(this.selectedVacuna)) {
        this.addRowToTableVacuna();
        this.selectedVacuna = null;
    } else {
        this.callToast("La vacuna ya se encuentra agregada.", 3000, "infoToast");
    }
  }

  addRowToTableVacuna() {
    let row = new VacunaRow(this.selectedVacuna, this.vacunasList.find(e => e.id == this.selectedVacuna).descripcion, '');
    this.vacunasTableData.push(row);
    this.changeRef.detectChanges();
    this.hasVacunasSeleccionadasData = true;
    this.vacunasAplicadas.push(this.selectedVacuna);
    let vacuna = new VacunaDto(this.selectedVacuna, new Date(), null);
    this.historialClinico.historialClinicoTipoVacunas.push(vacuna);
    this.isVacunaDropdownDisabled = true;
  }

  public removeVacuna(enf): void {
    let aux = this.vacunasAplicadas;
    this.vacunasAplicadas = aux.filter(e => e != enf);
    this.vacunasTableData = aux.filter(e => e != enf);
    this.callToast("Se removió la vacuna de " + this.vacunasList.find(v => v.id = enf).descripcion + ".", 3000, "okToast");
    this.historialClinico.historialClinicoTipoVacunas = this.historialClinico.historialClinicoTipoVacunas.filter(i => i.idTipoVacuna != enf);
    this.vacunasTableData = []
    this.historialClinico.historialClinicoTipoVacunas.forEach(e => {
      this.vacunasTableData.push(new VacunaRow(this.vacunasList.find(v => v.id == e.idTipoVacuna).descripcion, enf, e.fechaVencimiento));
    });
    if(this.vacunasTableData.length == 0 ) {
        this.hasVacunasSeleccionadasData = false;
        this.changeRef.detectChanges();
    }
    this.isVacunaDropdownDisabled = false;
  }

  fechaVtoVacuna: Date;


  isPracticaDropdownDisabled: boolean = false;
  isVacunaDropdownDisabled: boolean = false;
  isEnfermedadDropdownDisabled: boolean = false;
  isAntiparasitarioDropdownDisabled: boolean = false;


  public setPracticaDate(data, id): void {
    this.isPracticaDropdownDisabled = false;
    this.historialClinico.historialClinicoTipoPracticas.find(p => p.idTipoPractica == id).fechaVencimiento = data.value;
  }

  public setVacunaDate(data, id): void {
    this.isVacunaDropdownDisabled = false;
    this.historialClinico.historialClinicoTipoVacunas.find(p => p.idTipoVacuna == id).fechaVencimiento = data.value;
  }

  public setEnfermedadDolencia(data, id): void {
    this.isEnfermedadDropdownDisabled = false;
    this.historialClinico.historialClinicoEnfermedadesYDolencias.find(p => p.idTipoEnfermedad == id).dolencia = data.value;
  }
  public setEnfermedadTratamiento(data, id): void {
    this.historialClinico.historialClinicoEnfermedadesYDolencias.find(p => p.idTipoEnfermedad == id).tratamiento = data.value;
  }
  public setEnfermedadObs(data, id): void {
    this.historialClinico.historialClinicoEnfermedadesYDolencias.find(p => p.idTipoEnfermedad == id).observacion = data.value;
  }

  public setAntiparasitarioDate(data, id): void {
    this.isAntiparasitarioDropdownDisabled = false;
    this.historialClinico.historialClinicoTipoAntiparasitarios.find(p => p.idTipoAntiparasitario == id).fechaVencimiento = data.target.value;
  }

  public setDol(id, val): void {
    this.historialClinico.historialClinicoEnfermedadesYDolencias.find(e => e.idTipoEnfermedad == id).dolencia = val.target.value;
  }

  public setObs(id, val): void {
    this.historialClinico.historialClinicoEnfermedadesYDolencias.find(e => e.idTipoEnfermedad == id).observacion = val.target.value;
  }

  public setTrat(id, val): void {
    this.historialClinico.historialClinicoEnfermedadesYDolencias.find(e => e.idTipoEnfermedad == id).tratamiento = val.target.value;
  }

  private sumarTresHoras(valorHora: string): string {
    const partes = valorHora.split(':');
    const horas = parseInt(partes[0], 10);
    const minutos = parseInt(partes[1], 10);
    const nuevaHora = horas - 3;
    const horaFinal = (nuevaHora % 24).toString().padStart(2, '0');
    const minutosFinales = minutos.toString().padStart(2, '0');
    return `${horaFinal}:${minutosFinales}`;
  }
}

export class EnfermedadesRow {
  Enfermedad: string;
  Dolencia: string;
  Tratamiento: string;
  Observacion: string;
  id: any;

  constructor(enf, dolencia, tratamiento, observacion, id) {
    this.Enfermedad = enf;
    this.Dolencia = dolencia;
    this.Tratamiento = tratamiento;
    this.Observacion = observacion;
    this.id = id;
  }
}

export class AntiparasitariosRow {
    AntiParasitario: string;
    Aplicacion: Date;
    Vencimiento: Date;
    id: any;
  
    constructor(ant, ven, id) {
      this.AntiParasitario = ant;
      this.Aplicacion = new Date();
      this.Vencimiento = ven;
      this.id = id;

      this.Aplicacion.setHours(this.Aplicacion.getHours() - 3);
    }
}

export class VacunaRow {
    id: number;
    Vacuna: string;
    Aplicacion: Date;
    Vencimiento: Date;
  
    constructor(id, ant, ven) {
      this.id = id;
      this.Vacuna = ant;
      this.Aplicacion = new Date();
      this.Vencimiento = ven;

      this.Aplicacion.setHours(this.Aplicacion.getHours() - 3);
    }
}

export class PracticaRow {
    id: number;
    Practica: string;
    Aplicacion: Date;
    Vencimiento: Date;
  
    constructor(ant, ven, id) {
      this.id = id;
      this.Practica = ant;
      this.Aplicacion = new Date();
      this.Vencimiento = ven;

      this.Aplicacion.setHours(this.Aplicacion.getHours() - 3);
    }
}
