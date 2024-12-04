import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Profesional } from 'src/app/models/profesional.model';
import { Establecimiento } from 'src/app/models/sucursal.model';
import { AuthService } from 'src/app/services/auth.service';
import { SharedServices } from 'src/app/services/sharedServices.shared';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { LoadingService } from 'src/app/shared/loading/loading.service';
import { isNotNullAndNotUndefined } from '../../Utils/utils';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-vets',
  templateUrl: './vets.component.html',
  styleUrls: ['./vets.component.css']
})
export class VetsComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalComponent;

  public todosLosEspecialistas = [];

  public modalSub;

  public modalTxt;

  constructor(private changeRef: ChangeDetectorRef, private loadingService: LoadingService, private sharedServices: SharedServices, private suppliersService: SuppliersService, private authService: AuthService) { }

  ngOnInit(): void {
    this.establecimientos = [];
    this.especialistas = [];
    this.suppliersService.obtenerEstablecimientosPaginados(this.buildRequest()).then(data => {
      this.establecimientos = data.data.datos;
    }).then(() => this.callEstablecimientos());
  }
  private callEstablecimientos(): void {
    this.establecimientos.forEach(est => {
      this.suppliersService.obtenerEspecialistasPorIdEstablecimiento(est.id).then(data => {
        if(isNotNullAndNotUndefined(data.data) && data.data.length > 0) {
          data.data.forEach(esp => {
              this.especialistas.push(this.castEspecialista(esp));
          });
        }
      });
    });
    this.changeRef.detectChanges();
  }

  public test(): void {
  this.loadingService.show();
  setTimeout(() => {
    this.loadingService.hide();
  }, 4000);
  }

  especialistas = [];
  establecimientos = [];
  profs = Array<Profesional>();

  public castEspecialista(esp) {
      let p = new Profesional();
      p.id = esp.id;
      p.nombre = esp.nombre;
      p.especialidad = esp.especialidadDescripcion;
      p.actions = ["Ver detalle"];
      return p;
  }

  private buildRequest(): any {
    let req = new Establecimiento();
    req.IdUsuario = this.authService.getUsuarioCredenciales().id;
    req.RegistrosPorPagina = 100;
    req.NumeroPagina = 1;
    return req;
  }

  public getColHeaders(): Array<string> {
    return ["Id", "Nombre", "Especialidad", "Acciones"];
  }

  public onAction(data): void {
    // this.modal.
  }

  public itemArray = [];
  public onRowAction(event): void {
    this.itemArray = [];
    this.sharedServices.obtenerEspecialistaPorId(event.id).then(data => {
      let nombre = "Nombre: " + data.data.nombre + " " + data.data.apellido;
      let matricula = "Matrícula: " + data.data.matricula;
      let especialidad = "Especialidad: " + event.especialidadDescripcion;
      let activo = "Estado: " + (data.data.estaActivo ? "Activo" : "Fuera de servicio");
      let ee = this.establecimientos.find(e => e.id == data.data.idEstablecimiento);
      debugger
      let establecimiento = ee.calle + " " + ee.numero + ", " + ee.tipoProvinciaDescripcion;
      let prov = "Provincia en la que ejerce: " + ee.tipoLocalidadDescripcion;
      this.itemArray.push(nombre, especialidad, matricula, activo, establecimiento, prov);  
      this.modal.show();
    })

  }

  public onConfirmModal(): void {
    this.modal.close();
  }
}
