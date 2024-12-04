import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Calendar, CalendarOptions, ToolbarInput } from '@fullcalendar/core';
import { Subject, last, takeUntil } from 'rxjs';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { LoadingService } from 'src/app/shared/loading/loading.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { convertirAParametros, formatearFecha, isNotNullAndNotUndefined } from '../../Utils/utils';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Establecimiento } from 'src/app/models/sucursal.model';
import { Profesional } from 'src/app/models/profesional.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedServices } from 'src/app/services/sharedServices.shared';
import { Turno } from 'src/app/models/turno.model';
import { ClientService } from 'src/app/services/client.service';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleAnalyticsService } from '../../Utils/google-analytics.service';

@Component({
  selector: 'app-shiftsc',
  templateUrl: './shiftsc.component.html',
  styleUrls: ['./shiftsc.component.css']
})
export class ShiftscComponent implements OnInit {

  @ViewChild('modal', {static: false}) modal: ModalComponent;
  @ViewChild(FullCalendarComponent) calendarComponent: FullCalendarComponent;
  @ViewChild(ModalComponent) modalComponent: ModalComponent;
  @ViewChild('fullcalendar') fullcalendar!: FullCalendarComponent;

  public shiftsList: any[] = [];
  private ngUnsubscribe = new Subject<void>();
  public currentDay: string = "";
  public firstActionTxtBtn: string = "";
  public secondActionTxtBtn: string = "";
  private selectedShift: string;
  public petId: string; 
  public motivoConsulta: string;
  public modalTitle: string;
  public turnoOcupado: boolean = false;
  public anoSeleccionado: number = 2023;
  public mesSeleccionado: number = 0;
  public diaSeleccionado: number = 1;
  public horarioSeleccionado: string = '08:00';
  public exactDay: string = "";
  private ownerName: string;
  private especialistaId: string;
  private motivo: string;
  public meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public calendarApi: Calendar;
  public anos: number[] = [2023, 2024];
  public dias: { numero: number; nombre: string }[] = [];
  public horarios: string[] = [];
  public showCalendar: boolean = false;
  public establecimientos: Establecimiento[] = [];
  public establecimientoSeleccionado: any;
  public profesionales: Profesional[] = [];
  public profesionalSeleccionado: any;
  public profesionalDisabled: boolean = true;
  private selectedDay: string;
  private selectedHour: string;
  private selectedYear: string;
  private selectedMonth: string;
  public durationInSeconds: number = 5;
  public idEspecialista;
  public showInputText = false;
  public isSuccessDisabled = false;
  public veterinarias = [];
  public vetSeleccionada;
  public mascotas = [];
  public mascotaSeleccionada;
  public tieneMascotas: boolean = false;
  public mascotaSeleccionadaParaBuscar: any;
  public panelOpenState: boolean = false;

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public redirectPet(pet: string): void {
    this.router.navigate(['medical-history/'.concat(pet)]);
  }
  
  public newShift(): void {
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
    }, 500);
    this.router.navigate(['suppliers/new-shift']);
  }

  constructor(private googleAnalyticsService: GoogleAnalyticsService, private authService:AuthService, private router: Router, private clientsService: ClientService, private suppliersService: SuppliersService, private loadingService: LoadingService, private snackBar: MatSnackBar, private sharedServices: SharedServices, private detectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.establecimientoSeleccionado = new Establecimiento();
    this.showCalendar = true;
    setTimeout(() => {
      this.calendarApi = this.calendarComponent.getApi();
    }, 1000);
    this.cleanForm();
    this.checkConfirmButtonValidation();
    this.obtenerVeterinarias();
    this.obtenerMascotas();
  }

  private obtenerMascotas() {
    this.clientsService.buscarMascotas(this.authService.getUsuarioCredenciales().id).then(data => {
      this.mascotas = data.data.filter(m => m.estaActivo == true);
      if (data.data.length > 0) {
        this.tieneMascotas = true;
      } else {
        this.tieneMascotas = false;
        this.callToast("Aún no tiene mascotas registradas", 4000, "infoToast");
      }
      this.detectorRef.detectChanges();
    }, error => {
      this.tieneMascotas = false;
      this.callToast("Ocurrió un erro al intentar obtener las masctoas", 4000, "errorToast");
    });

  }

  private obtenerVeterinarias() {
    this.clientsService.ObtenerUsuariosVeterinarias(this.requestObtenerVeterinarias()).then(data => {
      if (isNotNullAndNotUndefined(data.data.datos)) {
        data.data.datos.forEach(element => {
          if (element.cantidadEstablecimientos > 0) {
            this.veterinarias.push(element);
          }
        });
      }
    }, error => {
      this.callToast("Ocurrió un error al intentar buscar las veterinarias", 4000, "errorToast");
    });
  }

  private requestObtenerVeterinarias() {
    return {
      "registrosPorPagina": 100,
      "numeroPagina": 1
    }
  }

  simulateLoading() {
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
    }, 500);
  }

  private cleanForm() {
    this.diaSeleccionado = null;
    this.mesSeleccionado = null;
    this.anoSeleccionado = null;
    this.horarioSeleccionado = null;
    this.turnoOcupado = false;
    // (document.getElementById("campo1") as HTMLInputElement).value = null;
    // (document.getElementById("campo2") as HTMLInputElement).value = null;
    this.petId = null;
    this.especialistaId = null;
    this.motivoConsulta = null;
  }

  llenarDias() {
    if(isNotNullAndNotUndefined(this.selectedMonth)) {
      this.dias = [];
      for (let i = 1; i <= 31; i++) {
        const fecha = new Date(this.anoSeleccionado, this.mesSeleccionado, i);
        const diaSemana = fecha.getDay();
        if (diaSemana !== 0 && diaSemana !== 6) {
          const nombreDia = `${i} - ${format(fecha, 'EEEE', { locale: es })}`;
          this.dias.push({ nombre: nombreDia, numero: i });
        }
      }
    }
  }

  llenarHorarios() {
    this.horarios = [];
    for (let hora = 8; hora <= 18; hora++) {
      const horaFormato = hora < 10 ? `0${hora}:00` : `${hora}:00`;
      this.horarios.push(horaFormato);
    }
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    eventClick: this.handleDateClick.bind(this),
    events: [],
    headerToolbar: {
      center: 'customPrevButton'
    },
    customButtons: {
      customPrevButton: {
        text: 'Mes actual',
        click: () => this.showMonthView(),
      }
    }
  };

  showPrev() {
    const calendarApi: Calendar = this.calendarComponent.getApi();
    calendarApi.prev();
  }

  showNext() {
    const calendarApi: Calendar = this.calendarComponent.getApi();
    calendarApi.next();
  }

  private setColorByState(state: string, estaAceptado: boolean): string {
    let bgColor;
    if(estaAceptado) {
      switch (state) {
        case "Programada":
        bgColor = "#FFC37C";
        break;
      case "Completada":
        bgColor = "#9CD39C";
        break;
      case "Cancelada":
        bgColor = "#FF6654";
        break;
      }
    } else {
      if(state == "Completada") {
        bgColor = "#9CD39C"
      } else {
      bgColor = "#FF6654"
      }
    }
    return bgColor;
  }

  private setColorNotMyShift(state: string, estaAceptado: boolean): string {
    return '#ACC3D0';
  }

  private idTurnoSeleccionado: number;
  handleDateClick(data) {
    this.googleAnalyticsService.click("Evento de FullCalendar");
    if(data.event.extendedProps.idUsuarioCliente == this.authService.getUsuarioCredenciales().id) {
      this.especialistaId = data.event.extendedProps.idEspecialista;
      this.sharedServices.obtenerEspecialistaPorId(data.event.extendedProps.idEspecialista).then(res => {
        this.storeShift(data.event.extendedProps);
        this.selectedShift = data.event.extendedProps.fecha + " " + data.event.extendedProps.hour;
        this.cleanButtons();
        this.modalTitle = "Turno: " + data.event.extendedProps.pet + " " + data.event.extendedProps.hour + "hs";
        this.modalComponent.modalTitle = data.event.extendedProps.pet + ", " + data.event.extendedProps.hour + "hs";
        let feedbackTurno = (isNotNullAndNotUndefined(data.event.extendedProps.respuestaTurno) && data.event.extendedProps.respuestaTurno.length > 5) ? data.event.extendedProps.respuestaTurno : "Pendiente de atención."
        this.modalComponent.arrayList = [
          `Fecha: ${formatearFecha(data.event.startStr)}`,
          `Dueño: ${data.event.extendedProps.owner}`,
          `Estado de consulta: ${data.event.extendedProps.state}`,
          `Especialista: ${res.data.nombre + ' ' + res.data.apellido}`,
          `Detalle de consulta: ${feedbackTurno}`
        ];
        this.currentDay = formatearFecha(data.event.startStr);
        this.exactDay = data.event.extendedProps.fecha;
        this.buildButtons(data.event.extendedProps.state);
        this.modalComponent.show();
      })
    } else {
      this.callToast("Este turno está ocupado por otro cliente", 3000, "warningToast");
    }
  }

  buildButtons(estado: string) {
    switch (estado) {
      case "Programada":
      this.secondActionTxtBtn = "Cancelar";
      break;
    }
  }
  
  cleanButtons() {
    this.firstActionTxtBtn = "";
    this.secondActionTxtBtn = "";
  }

  public showDayView(): void {
    const calendarApi: Calendar = this.calendarComponent.getApi();
    calendarApi.changeView('dayGridDay', this.currentDay);
  }

  private showSelectedDay(): void {
    const calendarApi: Calendar = this.calendarComponent.getApi();
    calendarApi.changeView('dayGridDay', this.exactDay);
  }

  public showMonthView(): void {
    const calendarApi: Calendar = this.calendarComponent.getApi();
    calendarApi.changeView('dayGridMonth');
  }

  public onConfirmModal(): void{
    this.loadingService.show();
    this.showSelectedDay();
    setTimeout(() => {
      this.loadingService.hide();
    }, 250);
  }

  public createNuevoTurno(): void {
    let selectedFullDate = this.selectedYear.concat("-").concat(this.selectedMonth.length == 1 ? "0".concat(this.selectedMonth) : this.selectedMonth).concat("-").concat(this.selectedDay.length == 1 ? "0".concat(this.selectedDay) : this.selectedDay).concat(" ").concat(this.selectedHour);
    if(this.obtenerTodosLosTurnos().includes(selectedFullDate)) {
      this.callToast("El turno se encuentra ocupado, escoja otro.", 3000, "errorToast");
    } else {
      this.loadingService.show();
      let req = new Turno();
      req.idEspecialista = this.profesionalSeleccionado;
      // req.idEspecialista = parseInt((document.getElementById("campo2") as HTMLInputElement).value);
      req.idPaciente = parseInt(this.mascotaSeleccionada);
      req.fechaCreacion = new Date();
      req.fechaTurno = new Date(this.selectedYear.concat("-").concat(this.selectedMonth.length == 1 ? "0".concat(this.selectedMonth) : this.selectedMonth).concat("-").concat(this.selectedDay.length == 1 ? "0".concat(this.selectedDay) : this.selectedDay).concat(" ").concat(this.sumarTresHoras(this.selectedHour)));
      this.sharedServices.crearTurno(req).then(data => {
        this.googleAnalyticsService.click("Creación de nuevo turno");
        this.callToast("Se agendó un nuevo turno el " + this.selectedDay.concat("/").concat(this.selectedMonth).concat("/").concat(this.selectedYear).concat(" a las ").concat(this.selectedHour), 3000, "okToast");
        this.refreshTurnos(this.especialistaId);
        this.cleanForm();
        this.sharedServices.updateNotifications();
      }, error => {
        if(isNotNullAndNotUndefined(error.response.data.exception)) {
          this.callToast("Ocurrió un error al querer agendar un turno: " + error.response.data.exception[0].detail, 3000, "errorToast");
        } else {
          this.callToast("Ocurrió un error al querer agendar un turno: " + error.response.data.errors['FechaTurno'][0], 3000, "errorToast");
        }
      });
      this.loadingService.hide();
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

  private obtenerTodosLosTurnos(): string[] {
    let todosLosTurnos = [];
    this.calendarApi.getEvents().forEach(element => {
      let fecha = element.extendedProps['fecha'];
      let hora = element.extendedProps['hour'];
      todosLosTurnos.push(fecha.concat(" ").concat(hora));
    });
    return todosLosTurnos;
  }

  public setAno(data): void {
    this.selectedYear = data.target.value;
    this.checkConfirmButtonValidation();
    this.googleAnalyticsService.click("dropdown de año");
  }
  public setDia(data): void {
    this.selectedDay = data.target.value;
    this.checkConfirmButtonValidation();
    this.llenarHorarios();
    this.googleAnalyticsService.click("Dropdown de dia");
  }
  public setHorario(data): void {
    this.selectedHour = data.target.value;
    this.checkConfirmButtonValidation();
    this.googleAnalyticsService.click("Dropdown de horario");
  }
  public setMes(data): void {
    this.selectedMonth = (parseInt(data.target.value)+1).toString();
    this.checkConfirmButtonValidation();
    this.llenarDias();
    this.googleAnalyticsService.click("Dropdown de mes");
  }

  public setValue(parametro, value): void {
    switch (parametro) {
      case 'mascota':
        this.petId = value.target.value;
      break;
      case 'name':
        this.especialistaId = value.target.value;
        this.setProfesional();
      break;
      case 'motivo':
        this.motivoConsulta = value.target.value;
      break;
      case 'especialista':
        this.idEspecialista = value.target.value;
       
    }
    this.checkConfirmButtonValidation();
  }

  private getOwnerById(id: any): string {
    //Llamado al servico
    return "Beto";
  }

  private isFormValid(): boolean {
    return isNotNullAndNotUndefined(this.selectedDay) 
      && isNotNullAndNotUndefined(this.selectedMonth)
      && isNotNullAndNotUndefined(this.selectedHour)
      && isNotNullAndNotUndefined(this.selectedYear)
      && isNotNullAndNotUndefined(this.mascotaSeleccionada)
      && isNotNullAndNotUndefined(this.especialistaId)
  }

  private checkConfirmButtonValidation(): void {
    let btn = document.getElementById("confirmButton");
    if(this.isFormValid()) {
      btn.classList.remove("disabled");
    } else {
      btn.classList.add("disabled");
    }
  }

  public action(action: string): void {
    switch (action) {
      case "Cancelar":
        this.loadingService.show();
        this.sharedServices.finalizarTurno(this.buildRequest(action)).then(data => {
          this.callToast("Se canceló el turno exitosamente", 3000, "okToast");
          this.refreshTurnos(this.especialistaId); //cambiar por this.especialistaId luego
          this.googleAnalyticsService.click("Cancelación de turno");
        }, error => {
          this.loadingService.hide();
          this.callToast("Ocurrió un error al intentar cancelar un turno", 3000, "errorToast");
        });
      break;
    }
  }

  private buildRequest(action): Turno {
    let turno = new Turno();
    if(typeof action !== "string" && action.action == "Actualizar") {
        turno.estadoConsultaDescripcion = "Completada";
        turno.idEstadoConsulta = 2;
        turno.idTurno = parseInt(this.temporalModel.idTurnoSeleccionado);
        turno.idEspecialista = parseInt(this.temporalModel.idEspecialista);
        turno.nombrePaciente = this.temporalModel.nombrePaciente;
        turno.idPaciente = parseInt(this.temporalModel.idPaciente);
        turno.nombreUsuario = this.temporalModel.nombreUsuario;
        turno.fechaTurno = this.temporalModel.fechaTurno;
    } else if (typeof action !== "string" && action.action == "Completar") {
      turno.estadoConsultaDescripcion = "Completada";
        turno.idEstadoConsulta = 2;
        turno.respuestaTurno = action.descripcion;
        turno.idTurno = parseInt(this.temporalModel.idTurnoSeleccionado);
    } else {
      turno.idEstadoConsulta = 3;
      turno.respuestaTurno = "Cancelado";
      turno.idTurno = parseInt(this.temporalModel.idTurnoSeleccionado);
    }
    return turno;
  }

  public actionComplete(data): void {
    switch (data.action) {
      case "Completar":
        this.sharedServices.finalizarTurno(this.buildRequest(data)).then(data => {
          this.callToast("Se completó el turno exitosamente", 3000, "okToast");
          this.refreshTurnos(this.especialistaId); //cambiar por this.especialistaId luego
        }, error => {
          this.callToast("Ocurrió un error al intentar completar un turno", 3000, "errorToast");
        });
      break;
      case "Actualizar":
        this.sharedServices.actualizarTurno(this.buildRequest(data)).then(data => {
          this.callToast("Se actualizó el turno exitosamente", 3000, "okToast");
          this.refreshTurnos(this.especialistaId); //cambiar por this.especialistaId luego
        }, error => {
          this.callToast("Ocurrió un error al intentar actualizar un turno", 3000, "errorToast");
        });
      break;
    }
  }

  public setProfesional(): void {
    let req = new Turno();
    req.NumeroPagina = 1;
    req.RegistrosPorPagina = 400;
    this.especialistaId = this.profesionalSeleccionado;
    req.idEspecialista = this.profesionalSeleccionado; //probar con 1 el manejo de turnos
    this.obtenerTurnos(req);
    this.googleAnalyticsService.click("Dropdown profesional");
  }
 
  public setEstablecimiento(): void {
    this.fullcalendar.getApi().removeAllEvents();
    this.loadProfesionales();
    this.profesionalDisabled = false;
    this.cleanForm();
    this.googleAnalyticsService.click("Dropdown establecimiento");
  }

  private loadProfesionales(): void {
    this.suppliersService.obtenerEspecialistasPorIdEstablecimiento(this.establecimientoSeleccionado).then(data => {
      this.profesionales = data.data;
      this.profesionalDisabled = false;
    }, error => {
      if(isNotNullAndNotUndefined(error.response.data.exception)) {
        error.response.data.exception.forEach(e => {
          this.callToast(e.detail, 3000, "warningToast");
          this.profesionalDisabled = true;
        });
      }
    })
  }


  public obtenerTurnos(req): void {
    this.sharedServices.obtenerTurnos(req).then(data => {
      this.parseoResponse(data.data.datos);
    }, error => {
      // this.fullcalendar.getApi().removeAllEvents();
      if(isNotNullAndNotUndefined(error.response.data.exception)) {
        error.response.data.exception.forEach(e => {
          this.callToast(e.detail, 3000, "infoToast");
        });
      }
    });
  }

  public crearTurno(req): void {
    let r = new Turno();
    this.sharedServices.crearTurno(r).then(data => {
      debugger;
    }, error => {
      debugger;
    });
  }

  public actualizarTurno(req): void {
    this.sharedServices.actualizarTurno(req).then(data => {
      debugger;
    }, error => {
      debugger;
    });
  }

  public finalizarTurno(req): void {
    this.sharedServices.finalizarTurno(req).then(data => {
      debugger;
    }, error => {
      debugger;
    });
  }

  public obtenerTurnoPorId(): void {
    let id;
    this.sharedServices.obtenerTurnoPorId(id).then(data => {
      debugger;
    }, error => {
      debugger;
    });
  }

  public cambioEstadoTurno(): void {
    let id;
    this.sharedServices.cambioEstadoTurno(id).then(data => {
      debugger;
    }, error => {
      debugger;
    });
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

  private parseoResponse(turnos): void {
    const jsonObjects: object[] = [];
    let obj = {};
    for (const objeto of turnos) {
      if(this.authService.getUsuarioCredenciales().id == objeto.idUsuarioCliente) {
        obj = {
          "title": objeto.nombrePaciente + " " + this.obtenerHora(objeto.fechaTurno),
          "date": this.obtenerDia(objeto.fechaTurno),
          "hour": this.obtenerHora(objeto.fechaTurno),
          "pet": objeto.nombrePaciente,
          "owner": objeto.nombreUsuario,
          "fecha": this.obtenerDia(objeto.fechaTurno), 
          "state": objeto.estadoConsultaDescripcion,
          "color": this.setColorByState(objeto.estadoConsultaDescripcion, objeto.turnoAceptado),
          "aceptado": objeto.turnoAceptado,
          "idTurno": objeto.id,
          "idPaciente": objeto.idPaciente,
          "idEspecialista": objeto.idEspecialista,
          "nombrePaciente": objeto.nombrePaciente, 
          "respuestaTurno": objeto.respuestaTurno,
          "idUsuarioCliente": objeto.idUsuarioCliente
        }
      } else {
        obj = {
          "title": this.obtenerHora(objeto.fechaTurno) + 'hs',
          "date": this.obtenerDia(objeto.fechaTurno),
          "hour": this.obtenerHora(objeto.fechaTurno),
          "state": objeto.estadoConsultaDescripcion,
          "color": this.setColorNotMyShift(objeto.estadoConsultaDescripcion, objeto.turnoAceptado),
          "fecha": this.obtenerDia(objeto.fechaTurno)
        }
      }
      const jsonObject = JSON.stringify(obj);
      jsonObjects.push(JSON.parse(jsonObject));
    }
  
    this.calendarOptions.events = jsonObjects;
  }

  private obtenerDia(fechaHoraString: string): string | null {
    const formatoFechaHora = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}$/;
    const fechaHora = new Date(fechaHoraString);
    const dia = `${fechaHora.getFullYear()}-${String(fechaHora.getMonth() + 1).padStart(2, '0')}-${String(fechaHora.getDate()).padStart(2, '0')}`;
    return dia;
  }

  private obtenerHora(fechaHoraString: string): string | null {
    const formatoFechaHora = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}$/;
    const fechaHora = new Date(fechaHoraString);
    const hora = `${String(fechaHora.getHours()).padStart(2, '0')}:${String(fechaHora.getMinutes()).padStart(2, '0')}`;
    return hora;
  }

  private storeShift(data): void {
this.temporalModel.idTurnoSeleccionado = data.idTurno;
this.temporalModel.fechaTurno = new Date(data.fecha + " " + data.hour);
this.temporalModel.nombreUsuario = data.nombreUsuario;
this.temporalModel.nombrePaciente = data.nombrePaciente;
this.temporalModel.idEspecialista = data.idEspecialista;
this.temporalModel.idPaciente = data.idPaciente;
this.temporalModel.nombreUsuario = data.owner;
  }

  temporalModel: TemporalModel = new TemporalModel();

  private refreshTurnos(especialistaId): void {
    this.loadingService.show();
    this.fullcalendar.getApi().removeAllEvents();
    let req = new Turno();
    req.NumeroPagina = 1;
    req.RegistrosPorPagina = 400;
    req.idEspecialista = especialistaId;
    this.obtenerTurnos(req);
    setTimeout(() => {
      this.loadingService.hide();
    }, 500);
  }

  public setVeterinarias(): void {
    this.fullcalendar.getApi().removeAllEvents();
    this.establecimientos = [];
    this.suppliersService.obtenerEstablecimientosPaginados(this.buildEstablecimientosRequest()).then(data => {
      if(isNotNullAndNotUndefined(data.data.datos)) {
        data.data.datos.forEach(element => {
          if(element.cantidadEspecialistas > 0) {
            this.establecimientos.push(element);
          }
        });
        if(this.establecimientos.length == 0) {
          this.callToast("Ninguno de los establecimientos posee esepcialistas disponibles", 3000, "warningToast");
        }
      }
    });
  }

  private buildEstablecimientosRequest() {
    let req = new Establecimiento();
    req.IdUsuario = this.vetSeleccionada;
    req.RegistrosPorPagina = 100;
    req.NumeroPagina = 1;
    return req;
  }

  public buscarMascotas() {
    // this.sharedServices.busca
  }

  public buscarTurnosPorMascota(): void {
    this.calendarApi.removeAllEvents();
    let req = {
      'RegistrosPorPagina': "100",
      'NumeroPagina': "1",
      'idPAciente': this.mascotaSeleccionadaParaBuscar
    }
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
    }, 300);
    this.clientsService.buscarTurnosPorIdMascota(req).then(data => {
      this.parseoResponse(data.data.datos);
    }, error => {
      debugger
    })
  }
}

export class TemporalModel {
  fechaTurno: Date;
  nombreUsuario: string;
  nombrePaciente: string;
  estadoSeleccionado: string;
  idTurnoSeleccionado: string;
  respuestaTurno: string;
  idEspecialista: string;
  idPaciente: string;
}