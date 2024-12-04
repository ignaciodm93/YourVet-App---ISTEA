import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppSettings } from 'appsettings-json-reader';
import { Observable } from 'rxjs';
import { Establecimiento } from 'src/app/models/sucursal.model';
import { Turno } from 'src/app/models/turno.model';
import { BaseMicroService } from 'src/app/services/base.microservice';
import { SharedServices } from 'src/app/services/sharedServices.shared';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { LoadingService } from 'src/app/shared/loading/loading.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'testme',
  templateUrl: './testme.component.html',
  styleUrls: ['./testme.component.css']
})
export class TestComponent implements OnInit {

  toppings = new FormControl('');
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  constructor(private httpClient: HttpClient, private loadingService: LoadingService, private datePipe: DatePipe, private baseMicroService: BaseMicroService, private sharedServices: SharedServices, private suppliersService: SuppliersService) { }

  ngOnInit(): void {

  }

  public test(): void {
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
    }, 1000);
  }

  public onConfirmModal(): void {
    console.log("on confirm modal");
  }

  public getList(): Array<Turno> {
    let list: Array<Turno> = [];

    let mock1: Turno = new Turno();
    // mock1.fecha = this.datePipe.transform(new Date());
    // mock1.fecha = new Date();
    // mock1.hour = '12.00 PM';
    // mock1.name = "Boris";
    // mock1.state = "Pendiente";
    // mock1.actions = ['Aceptar', 'Rechazar'];
    // let mock2: Turno = new Turno();
    // mock2.fecha = new Date();
    // mock2.hour = '11.00 AM';
    // mock2.name = "Roger";
    // mock2.state = "Aceptado";
    // mock2.actions = ['Cancelar'];
    // let mock3: Turno = new Turno();
    // mock3.fecha = new Date();
    // mock3.hour = '13.30 PM';
    // mock3.name = "Roger";
    // mock3.state = "Cancelado";

    // list.push(mock1, mock2, mock1, mock2, mock3, mock3, mock2, mock1, mock2, mock2);
    return list;
  }

  public getColHeaders(): Array<string> {
    return ["date", "hour", "name", "estado", "actions"];
  }
  private readonly URL: string = environment.apiUrl
  public obtenerPacientePorId() {
    this.sharedServices.obtenerPacientePorId("2").then(data => {
      debugger;
      return;
    });
  }

  public obtenerPacientePorId2() {
    this.httpClient.post(this.URL+"api/Paciente/ObtenerPacientePorId", {idPaciente:2}).subscribe((data: any) => {
    debugger;
    });
  }

  public getProvincias(){
    this.sharedServices.getProvincias().then(data => {
      debugger;
      return;
    });
  }

  public getAntiparasitarios(){
    this.sharedServices.getAntiparasitarios().then(data => {
      debugger;
      return;
    });
  }

  public getCalificacion(){
    this.sharedServices.getCalificacion().then(data => {
      debugger;
      return;
    });
  }

  public getCodigosArea(){
    this.sharedServices.getCodigosArea().then(data => {
      debugger;
      return;
    });
  }

  public getDocumentos(){
    this.sharedServices.getDocumentos().then(data => {
      debugger;
      return;
    });
  }

  public getEnfermedades(){
    this.sharedServices.getEnfermedades().then(data => {
      debugger;
      return;
    });
  }

  public getEspecialidad(){
    this.sharedServices.getEspecialidad().then(data => {
      debugger;
      return;
    });
  }

  public getEstadosConsulta(){
    this.sharedServices.getEstadosConsulta().then(data => {
      debugger;
      return;
    });
  }

  public getLocalidades(){
    this.sharedServices.getLocalidades().then(data => {
      debugger;
      return;
    });
  }

  public getPracticas(){
    this.sharedServices.getPracticas().then(data => {
      debugger;
      return;
    });
  }
  
  public getRaza(){
    this.sharedServices.getRaza().then(data => {
      debugger;
      return;
    });
  }

  public getSexo(){
    this.sharedServices.getSexo().then(data => {
      debugger;
      return;
    });
  }

  public getVacunas(){
    this.sharedServices.getVacunas().then(data => {
      debugger;
      return;
    });
  }

  public obtenerEstablecimientosPaginados() {
    let req = new Establecimiento();
    // req.IdUsuario = 4;
    req.IdUsuario = 4;
    req.NumeroPagina = 1;
    req.RegistrosPorPagina = 10;
    this.suppliersService.obtenerEstablecimientosPaginados(req).then(data => {
      debugger;
    }
    );
  }
}
