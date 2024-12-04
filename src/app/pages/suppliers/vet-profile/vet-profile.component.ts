import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewChildren, inject } from '@angular/core';
import { Veterinaria } from 'src/app/models/veterinaria.model';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { takeUntil, Subject } from 'rxjs';
import { Mascota } from 'src/app/models/mascota.model';
import { Profesional } from 'src/app/models/profesional.model';
import { Establecimiento } from 'src/app/models/sucursal.model';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/loading/loading.service';
import { SharedServices } from 'src/app/services/sharedServices.shared';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { isNotNullAndNotUndefined } from '../../Utils/utils';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleAnalyticsService } from '../../Utils/google-analytics.service';

@Component({
  selector: 'app-vet-profile',
  templateUrl: './vet-profile.component.html',
  styleUrls: ['./vet-profile.component.css']
})
export class VetProfileComponent implements OnInit {

  vet: Veterinaria = new Veterinaria();

  @Input()
  vetId: string;

  private ngUnsubscribe = new Subject<void>();

  public hasProfile: boolean = true;

  public especialistas: Profesional[] = [];

  constructor(private googleAnalyticsService: GoogleAnalyticsService, private suppliersService: SuppliersService, private router: Router, private loadingService: LoadingService, private sharedServices: SharedServices, private snackBar: MatSnackBar, private changeRef: ChangeDetectorRef, private authService: AuthService) { }

  ngOnInit(): void {
    this.suppliersService.obtenerDatosMiVeterinaria(this.authService.getUsuarioCredenciales().id).then(data => {
      this.vet = this.setVet(data.data);
      if(isNotNullAndNotUndefined(this.vet.nombre)) {
        this.hasProfile = true;
      }
      this.loadingService.show();
      setTimeout(() => {
        this.loadingService.hide();
      }, 500);
      this.obtenerEstablecimientos();
    }); 


    // this.googleAnalyticsService.repeatGaMock();
    // this.googleAnalyticsService.iterarConRetraso();
  }

  private obtenerEspecialistas(idEstablecimiento) {
  }

  public redirect(destination: string): void {
    this.loadingService.show();
    this.router.navigate(['suppliers/'.concat(destination)]);
    setTimeout(() => {
      this.loadingService.hide();
    }, 1000);
  }

  public listDoctors(): string[] {
    let doctors: string[] = [];

    return ["Dr Sucre - Especialidad: Rutina", "Dra Bullrich - Especialidad: Cirugía", "Dr Burke - Especialidad: Transfuciones"];
  }

  public onConfirmModal(): void {

  }
  public profesionalName: string;
  public durationInSeconds: number = 5;

  public onCreate(data): void {
    this.loadingService.show();
    this.loadingService.hide();
    this.callToast(data, 3000, 'okToast');
  }

  public onCreateError(data): void {
    this.callToast("Ocurrió un error al crear el profesional " + data, 3000, 'errorToast');
  }

  public cambioEstado(event): void {
    this.suppliersService.cambioEstadoEstablecimiento(event.id.toString()).then(data => {
      this.obtenerEstablecimientos();
      this.callToast("Se actualizó el estado del establecimiento.", 3000, "okToast");
    }, error => {
      this.callToast("Ocurrió un error al intentar actualizar el establecimiento", 3000, "errorToast");
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

  public editInfo(): void {

  }

  private setVet(data) {
    let vet = new Veterinaria();
    vet.nombre = this.authService.getUsuarioCredenciales().nombreCompleto;
    vet.nombreVet = data.nombreVeterinaria
    vet.nombreUsuario = data.nombreUsuario;
    vet.telefono = data.telefono;
    vet.id = this.authService.getUsuarioCredenciales().id;
    vet.email = data.email;
    vet.documentoDescripcion = data.documentoDescripcion;
    vet.fechaRegistro = this.obtenerDia(data.fechaCreacion);
    vet.fechaUltimoLogin = this.obtenerDia(data.fechaUltimoLogin);
    vet.nrodoc = data.numeroDocumento;
    vet.fotoPerfilBase64 = data.fotoPerfilBase64;
    return vet;
  }

  private obtenerDia(fechaHoraString: string): string | null {
    const formatoFechaHora = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}$/;
    const fechaHora = new Date(fechaHoraString);
    const dia = `${fechaHora.getFullYear()}-${String(fechaHora.getMonth() + 1).padStart(2, '0')}-${String(fechaHora.getDate()).padStart(2, '0')}`;
    return dia;
  }

  private obtenerEstablecimientos(): void {
    let req = new Establecimiento();
    req.IdUsuario = this.authService.getUsuarioCredenciales().id;
    req.NumeroPagina = 1;
    req.RegistrosPorPagina = 10;
    this.suppliersService.obtenerEstablecimientosPaginados(req).then(response => {
      this.establecimientos = response.data.datos;
    }, error => {
      if(isNotNullAndNotUndefined(error.response.data.exception)) {
        error.response.data.exception.forEach(error => {
          if(error.detail == "No existen establecimientos cargados.") {
            this.callToast("Aun no tiene establecimientos declarados", 4000, "infoToast");
          }
        });
      }
      this.checkTooltip();
    });

  }
  public establecimientos: Establecimiento[] = [];

  private checkTooltip() {
    if (this.establecimientos.length == 0) {
      this.showProfTool = true;
    } else {
      this.showProfTool = false;
    }
  }

  public loadVetInfo(): void {
    //obtener la info de la veterinaria actual

  }

  public loadEspecialistas(id): void {
    this.suppliersService.obtenerEspecialistasPorIdEstablecimiento(id).then(data => {
      this.loadingService.show();
      this.especialistas = data.data;
      this.changeRef.detectChanges();
      setTimeout(() => {
        this.loadingService.hide();
      }, 500);
    }, error => {
      this.callToast(error.response.data.exception[0].detail, 3000, 'warningToast');
    });
  }

  public onCreateLocal(): void {
    this.obtenerEstablecimientos();
    this.googleAnalyticsService.click("Creación de local");
    this.showProfTool = false;
  }

  public onCreateProfessional(id): void {
    this.loadEspecialistas(id);
    this.googleAnalyticsService.click("Creación de profesional");
  }

  public actualizarInfoVeterinaria(data): void {
    let req = {
      "id": this.authService.getUsuarioCredenciales().id,
      "nombreVeterinaria": data.nombre,
      "numeroDocumento": data.doc,
      "idTipoDocumento": data.idTipoDoc,
      "fotoVeterinaria": data.fotoVeterinaria
    }
    this.suppliersService.actualizarInfoVeterinaria(req).then(data => {
      this.callToast("Se actualizó la información de la veterinaria.", 4000, 'okToast');
      this.refreshMyInfo();
      this.googleAnalyticsService.click("Actualización info veterinaria");
    }, error => {
      
      if(isNotNullAndNotUndefined(error.response.data.errors)) {
        error.response.data.errors.forEach(element => {
          this.callToast(element.detail, 4000, 'errorToast');
        });
      }
    });
  }

  private refreshMyInfo(): void {
    this.suppliersService.obtenerDatosMiVeterinaria(this.authService.getUsuarioCredenciales().id).then(data => {
      this.vet = this.setVet(data.data);
    });
  }

  showProfTool: boolean = false;
  public showProfTooltip(): boolean {
    return this.establecimientos.length < 1 ? true : false;
  }
}
