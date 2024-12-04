import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { HistorialClinico } from 'src/app/models/historialClinico.model';
import { AuthService } from 'src/app/services/auth.service';
import { SharedServices } from 'src/app/services/sharedServices.shared';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { LoadingService } from 'src/app/shared/loading/loading.service';
import { GoogleAnalyticsService } from '../../Utils/google-analytics.service';
import { ClientService } from 'src/app/services/client.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-medical-history',
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MedicalHistoryComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public medHistories: any = [];
  private vacunas: any[] = [];
  private antiparasitarios: any[]= [];
  private enfermedades: any[]= [];
  private practicas: any[]= [];
  public indx: number = 0;

  constructor(private snackBar: MatSnackBar, private clientService: ClientService, private googleAnalyticsService: GoogleAnalyticsService, private detRef: ChangeDetectorRef, private sharedServices: SharedServices, private loadingService: LoadingService, private suppliersService: SuppliersService, private authService: AuthService) {
    this.sharedServices.getVacunas().then(data => {
      this.vacunas = data.data;
    });
    this.sharedServices.getAntiparasitarios().then(data => {
      this.antiparasitarios= data.data;
    });
    this.sharedServices.getPracticas().then(data => {
      this.practicas= data.data;
    });
    this.sharedServices.getEnfermedades().then(data => {
      this.enfermedades= data.data;
    });
  }

  async ngOnInit() {
    await this.suppliersService.obtenerHCporUV(this.buildInitialRequest(1)).then(async data => {
      this.loadingService.show();
      this.dataSource = data.data.datos.reverse();
      this.detRef.detectChanges();
      this.loadingService.hide();
    });

    // this.loadingService.show();
    //setTimeout(() => {
    //   this.loadingService.hide();
    // }, 500);
  }

  dataSource = this.medHistories;
  columnsToDisplay = ['idTurno', "fechaEmision", "nombrePaciente", "nombreUsuariioCliente", "nombreEspecialista"];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: HistorialClinico | null;

  private buildInitialRequest(pag): any {
    let req = {
      'idUsuario': this.authService.getUsuarioCredenciales().id,
      'numeroPagina': pag,
      'registrosPorPagina': 40
    }
    return req;
  }

  public trad(i): string {
    let t = "";
    switch (i) {
      case "observaciones":
        t = "Observaciones";
        break;

      case "fechaEmision":
        t = "Fecha de emisión";
        break;

      case "nombreEspecialista":
        t = "Especialista";
        break;

      case "nombrePaciente":
        t = "Paciente";
        break;

      case "nachoCli":
        t = "Cliente";
        break;

      case "nombreUsuariioCliente":
        t = "Nombre del cliente"
        break;
      case "idTurno":
        t = "Id";
        break;
      case "nombreEspecialista":
        t = "Especialista";
        break;
    }
    return t;
  }


  formatearFecha(fechaString: string): string {
    const fecha = new Date(fechaString);
    let hora = fecha.getHours();
    let minutos = fecha.getMinutes();
    let segundos = fecha.getSeconds();
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const año = fecha.getFullYear();
    if (hora === 12) {
      hora = 0;
    }

    const horaFormateada = hora.toString().padStart(2, '0');
    const minFormateada = minutos.toString().padStart(2, '0');
    const segFormateada = segundos.toString().padStart(2, '0');
    const fechaFormateada = `${horaFormateada}:${minFormateada}:${segFormateada} hs, ${dia}/${mes}/${año}`;

    return fechaFormateada;
  }

  public datePipeMe(val, key): string {
    if (key.includes("fecha")) {
      return this.formatearFecha(val);
    } else {
      return val;
    }
  }

  public showVacunaName(id): string {
    return this.vacunas.find(v => v.id == id).descripcion;
  }

  public showPracticaName(id): string {
    return this.practicas.find(v => v.id == id).descripcion;
  }

  public showAntiparasitarioName(id): string {
      return this.antiparasitarios.find(v => v.id == id).descripcion;
  }

  public showEnfermedadName(id): string {
    return this.enfermedades.find(v => v.id == id).descripcion;
  }

  convertirFormatoFecha(fechaString: string): string {
    const fecha = new Date(fechaString);
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const año = fecha.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${año}`;
    return fechaFormateada;
  }

  public printRegister(row): void {
    this.googleAnalyticsService.click("Descarga historial clínico");
    this.clientService.print(row.historialClinicoEnfermedadesYDolencias[0].idHistorialClinico, "").then(data => {
      this.callToast("Se descargó el historial clínico de " + row.nombrePaciente, 4000, "okToast");
    });
  }

  public recall(dat): void {
    this.suppliersService.obtenerHCporUV(this.buildPageRequest(dat)).then(data => {
      this.dataSource = data.data.datos;
    });
  }

  private buildPageRequest(dat) {
    let totalRegs = 10;
    if(dat.pageIndex == 0) {
      totalRegs = 100;
    }
    return {
      'idUsuario': this.authService.getUsuarioCredenciales().id,
      'numeroPagina': dat.pageIndex+1,
      'registrosPorPagina': totalRegs
    }
  }

  private callToast(text, duration, status): void {
    this.snackBar.open(text, null, {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: status
    });
    setTimeout(() => {
      this.snackBar.dismiss();
    }, duration);
  }
}