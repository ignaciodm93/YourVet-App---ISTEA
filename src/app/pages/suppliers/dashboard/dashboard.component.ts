import { Component, OnInit } from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { SuppliersService } from '../../../services/suppliers.service';
import { RespuestaGraficoLineal, RespuestaGraficos } from 'src/app/models/RespuestaGraficos.model';
import { RespuestaKpis } from 'src/app/models/RespuestaKpis.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public datosKpis:RespuestaKpis
  public establecimientos:number=0
  public especialistas:number=0
  public clientes:number=0
  public pacientes:number=0
  public atenciones:number=0

  //#region torta
  // options GraficoTorta
  public datosGraficoTorta: RespuestaGraficos
  public viewTorta: [number, number] = [350, 300];

  gradientTorta: boolean = true;
  showLegendTorta: boolean = false;
  showLabelsTorta: boolean = false;
  isDoughnutTorta: boolean = true;
  legendPositionTorta: string = 'below';
  animationsTorta: boolean = true;
  arcWidthTorta: number = 0.5;
  tooltipDisabledTorta: boolean = false;

  colorSchemeTorta: Color = 
  {
    domain: [
      'rgba(173, 216, 230, 1)',
      'rgba(135, 206, 250, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(138, 43, 226, 1)',
      'rgba(70, 130, 180, 1)',
      'rgba(70, 89, 143, 1)',
      'rgba(106, 90, 205, 1)',
    ],
    name: '',
    selectable: false,
    group: ScaleType.Ordinal
  };
  //#endregion

  //#region graficoLinea

    datosGraficolinea: RespuestaGraficoLineal[]
    viewLinea: [number,number] = [700, 300];

    // options Grafico linea
    legend: boolean = false;
    showLabels: boolean = true;
    animations: boolean = true;
    xAxis: boolean = true;
    yAxis: boolean = true;
    showYAxisLabel: boolean = false;
    showXAxisLabel: boolean = false;
    xAxisLabel: string = 'aaaab';
    yAxisLabel: string = 'aaaa';
    timeline: boolean = false;

    colorScheme:Color = {
      domain: ['rgba(3,66,107)'],
      name: '',
      selectable: false,
      group: ScaleType.Linear
    };
  //#endregion

  constructor(private SuppliersService:SuppliersService) {}

  async ngOnInit() {
    this.datosGraficoTorta = await this.SuppliersService.obtenerDatosGraficoTorta()
    this.datosGraficolinea = await this.SuppliersService.obtenerDatosGraficoLinea();
    this.datosKpis= await this.SuppliersService.obtenerDatosKpis();
    this.cargarDatosKpis(this.datosKpis)
  }
  cargarDatosKpis(datosKpis: RespuestaKpis) {
    this.establecimientos=this.datosKpis.cantidadEstablecimientos;
    this.especialistas=this.datosKpis.cantidadEspecialistas;
    this.clientes=this.datosKpis.cantidadDeClientes;
    this.pacientes=this.datosKpis.cantidadDePacientes;
    this.atenciones=this.datosKpis.cantidadDeTurnos;
  }
 
  

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  public setLegend(dat): LegendPosition {
    return LegendPosition.Below;
  }
}
