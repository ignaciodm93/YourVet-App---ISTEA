import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Notificacion } from 'src/app/models/notificacion.model';
import { ClientService } from 'src/app/services/client.service';
import { GoogleAnalyticsService } from '../../Utils/google-analytics.service';
import { SharedServices } from 'src/app/services/sharedServices.shared';
import { LoadingService } from 'src/app/shared/loading/loading.service';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { AuthService } from 'src/app/services/auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableModule } from '@angular/material/table';
import { isNotNullAndNotUndefined } from '../../Utils/utils';

@Component({
  selector: 'app-notificatons-vet',
  templateUrl: './notifications-vet.component.html',
  styleUrls: ['./notifications-vet.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class NotificacionesVetComponent implements OnInit {

@ViewChild(MatPaginator) paginator: MatPaginator;

  public notificaciones: any = [];
  public indx: number = 0;

  constructor(private snackBar: MatSnackBar, private clientService: ClientService, private googleAnalyticsService: GoogleAnalyticsService, private detRef: ChangeDetectorRef, private sharedServices: SharedServices, private loadingService: LoadingService, private suppliersService: SuppliersService, private authService: AuthService) {
    
  }

  ngOnInit(): void {
    this.loadingService.show();
    this.suppliersService.notificacionesVet(this.buildInitialRequest(1)).then(data => {
        this.dataSource = data.data.datos.filter(n => n.notificacionVista == false);
        if (isNotNullAndNotUndefined(this.dataSource) && this.dataSource.length == 0) {
          this.callToast("No tiene notificaciones pendientes", 4000, "infoToast");
        }
    })
    this.loadingService.hide();
    
  }

  dataSource = this.notificaciones;
  columnsToDisplay = ['idTurno', "fechaTurno", "nombrePaciente", "nombreUsuarioCliente"];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: Notificacion | null;

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
      case "idTurno":
        t = "Turno";
        break;

      case "fechaTurno":
        t = "Fecha del turno";
        break;

      case "nombrePaciente":
        t = "Paciente";
        break;

      case "nombreUsuarioCliente":
        t = "Usuario cliente";
        break;

      case "nombreVeterinaria":
        t = "Veterinaria";
        break;

      case "calle":
        t = "Calle"
        break;
      case "numero":
        t = "Número";
        break;
      case "localidad":
        t = "Localidad";
        break;
        case "provincia":
            t = "Provincia";
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

  convertirFormatoFecha(fechaString: string): string {
    const fecha = new Date(fechaString);
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const año = fecha.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${año}`;
    return fechaFormateada;
  }

  public recall(dat): void {
    this.suppliersService.notificacionesVet(dat).then(data => {
        this.dataSource = data.data.datos;
    })
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

  public marcarComoVista(e): void {
    this.sharedServices.marcarComoVista(e.id).then(() => {
        this.sharedServices.updateNotifications();
    });
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
