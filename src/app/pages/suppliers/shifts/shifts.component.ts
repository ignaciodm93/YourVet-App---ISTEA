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
import { AuthService } from 'src/app/services/auth.service';
import { Mascota } from 'src/app/models/mascota.model';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal';
import { HistorialClinico } from 'src/app/models/historialClinico.model';
import { GoogleAnalyticsService } from '../../Utils/google-analytics.service';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css']
})
export class ShiftsComponent implements OnInit, OnDestroy {

  @ViewChild('modal', {static: false}) modal: ModalComponent;
  @ViewChild(FullCalendarComponent) calendarComponent: FullCalendarComponent;
  @ViewChild(ModalComponent) modalComponent: ModalComponent;
  @ViewChild('fullcalendar') fullcalendar!: FullCalendarComponent;
  @ViewChild(ConfirmationModalComponent) confirmationModal: ConfirmationModalComponent;

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
  public puedeBuscar: boolean = false;
  public criterioDeBusqueda: string;
  public valorDeBusqueda: string;
  public mascotas: Mascota[];
  public mascotasHabilitadas: boolean = false;
  public mascotaSeleccionada: any;
  public vacunasList: any[];
  public practicasList: any[];
  public antiparasitariosList: any[];
  public enfermedadesList: any[];

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

  constructor(private googleAnalyticsService: GoogleAnalyticsService, private changeRef: ChangeDetectorRef, private authService: AuthService, private router: Router, private suppliersService: SuppliersService, private loadingService: LoadingService, private snackBar: MatSnackBar, private sharedServices: SharedServices) { }

  ngOnInit(): void {
    this.establecimientoSeleccionado = new Establecimiento();
    this.showCalendar = true;
    setTimeout(() => {
      this.calendarApi = this.calendarComponent.getApi();
    }, 1000);
    this.cleanForm();
    this.checkConfirmButtonValidation();
    this.loadEstablecimientos();


    this.fillDropdowns();
  }

  private fillDropdowns() {
    this.sharedServices.getAntiparasitarios().then(data => {  
      this.antiparasitariosList = data.data;
    });
    this.sharedServices.getVacunas().then(data => {  
      this.vacunasList = data.data;
    });
    this.sharedServices.getPracticas().then(data => {   
      this.practicasList = data.data;
    });
    this.sharedServices.getEnfermedades().then(data => {   
      this.enfermedadesList = data.data;
    });
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
    (document.getElementById("campoMascota") as HTMLInputElement).value = null;
    (document.getElementById("campo2") as HTMLInputElement).value = null;
    this.petId = null;
    this.especialistaId = null;
    this.motivoConsulta = null;
    this.mascotaSeleccionada = null;
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

  private idTurnoSeleccionado: number;
  handleDateClick(data) {
    this.googleAnalyticsService.click("Calendario");
    this.storeShift(data.event.extendedProps);
    this.selectedShift = data.event.extendedProps.fecha + " " + data.event.extendedProps.hour;
    this.cleanButtons();
    this.modalTitle = "Turno: " + data.event.extendedProps.pet + " " + data.event.extendedProps.hour + "hs";
    this.modalComponent.modalTitle = data.event.extendedProps.pet + ", " + data.event.extendedProps.hour + "hs";
       
    if(data.event.extendedProps.state == "Completada") {
      this.modalComponent.arrayList = [
        `Fecha: ${formatearFecha(data.event.startStr)}`,
        `Dueño: ${data.event.extendedProps.owner}`,
        `Estado de consulta: ${data.event.extendedProps.state}`,
        `Detalle del turno: ${data.event.extendedProps.respuestaTurno}`
      ];
    } else {
      this.modalComponent.arrayList = [
        `Fecha: ${formatearFecha(data.event.startStr)}`,
        `Dueño: ${data.event.extendedProps.owner}`,
        `Estado de consulta: ${data.event.extendedProps.state}`,
      ];
    }

    this.currentDay = formatearFecha(data.event.startStr);
    this.exactDay = data.event.extendedProps.fecha;
    this.buildButtons(data.event.extendedProps.state);

    if("Programada".includes(data.event.extendedProps.state)) {
      this.modalComponent.showInputText = true;
      this.isSuccessDisabled = true;
      this.showInputText = true;
    } else {
      this.showInputText = false;
    }
    if("Programada".includes(data.event.extendedProps.state)) {
      this.confirmationModal.showInputText = true;
      this.isSuccessDisabled = true;
      this.showInputText = true;
      this.confirmationModal.arrayList = [
        `Fecha: ${formatearFecha(data.event.startStr)}`,
        `Dueño: ${data.event.extendedProps.owner}`,
        `Estado de consulta: ${data.event.extendedProps.state}`,
      ];
      this.modalTitle = "Turno: " + data.event.extendedProps.pet + " " + data.event.extendedProps.hour + "hs";
    this.confirmationModal.modalTitle = data.event.extendedProps.pet + ", " + data.event.extendedProps.hour + "hs";
      this.confirmationModal.show();
    } else {
      this.modalComponent.show();
    }
  }

  buildButtons(estado: string) {
    switch (estado) {
      case "Programada":
      this.firstActionTxtBtn = "Completar";
      this.secondActionTxtBtn = "Cancelar";
      this.showInputText = true;
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
    this.googleAnalyticsService.click("Creación de nuevo turno");
    let selectedFullDate = this.selectedYear.concat("-").concat(this.selectedMonth.length == 1 ? "0".concat(this.selectedMonth) : this.selectedMonth).concat("-").concat(this.selectedDay.length == 1 ? "0".concat(this.selectedDay) : this.selectedDay).concat(" ").concat(this.selectedHour);

    if(this.obtenerTodosLosTurnos().includes(selectedFullDate)) {
      // this.turnoOcupado = true;
      this.callToast("El turno se encuentra ocupado, escoja otro.", 3000, "errorToast");
    } else {
      this.loadingService.show();
      let req = new Turno();
      req.idEspecialista = parseInt((document.getElementById("campo2") as HTMLInputElement).value);
      req.idPaciente = this.mascotaSeleccionada;
      let f = new Date();
      f.setHours(f.getHours() - 3);
      req.fechaCreacion = f;
      req.fechaTurno = new Date(this.selectedYear.concat("-").concat(this.selectedMonth.length == 1 ? "0".concat(this.selectedMonth) : this.selectedMonth).concat("-").concat(this.selectedDay.length == 1 ? "0".concat(this.selectedDay) : this.selectedDay).concat(" ").concat(this.sumarTresHoras(this.selectedHour)));
      
      this.sharedServices.crearTurno(req).then(data => {
        this.callToast("Se agendó un nuevo turno el " + this.selectedDay.concat("/").concat(this.selectedMonth).concat("/").concat(this.selectedYear).concat(" a las ").concat(this.selectedHour), 3000, "okToast");
        this.refreshTurnos(this.profesionalSeleccionado);
        this.sharedServices.updateNotifications();
        setTimeout(() => {
          this.callToast("Se muestran los turnos para el último especialista consultado", 3000, "infoToast");
        }, 3500);
      }, error => {
        if(isNotNullAndNotUndefined(error.response.data.exception)) {
          this.callToast("Ocurrió un error al querer agendar un turno: " + error.response.data.exception[0].detail, 3000, "errorToast");
        } else {
          this.callToast("Ocurrió un error al querer agendar un turno: " + error.response.data.errors['FechaTurno'][0], 3000, "errorToast");
        }
      });

      //Crear historial clinico
      


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
    this.googleAnalyticsService.click("Dropdown año");
  }
  public setDia(data): void {
    this.selectedDay = data.target.value;
    this.checkConfirmButtonValidation();
    this.llenarHorarios();
    this.googleAnalyticsService.click("Dropdown de día");
  }
  public setHorario(data): void {
    this.selectedHour = data.target.value;
    this.checkConfirmButtonValidation();
    this.googleAnalyticsService.click("Dropdown horario");
  }
  public setMes(data): void {
    this.selectedMonth = (parseInt(data.target.value)+1).toString();
    this.checkConfirmButtonValidation();
    this.llenarDias();
    this.googleAnalyticsService.click("Dropdown mes");
  }

  public setValue(parametro, value): void {
    switch (parametro) {
      case 'id':
        this.mascotaSeleccionada = value.target.value;
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
          this.refreshTurnos(this.especialistaId);
          this.changeRef.detectChanges();
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
          this.refreshTurnos(this.especialistaId);
        }, error => {
          this.callToast("Ocurrió un error al intentar completar un turno", 3000, "errorToast");
        });
      break;
      case "Actualizar":
        this.sharedServices.actualizarTurno(this.buildRequest(data)).then(data => {
          this.callToast("Se actualizó el turno exitosamente", 3000, "okToast");
          this.refreshTurnos(this.especialistaId);
        }, error => {
          this.callToast("Ocurrió un error al intentar actualizar un turno", 3000, "errorToast");
        });
      break;
    }
  }

  public setProfesional(): void {
    this.fullcalendar.getApi().removeAllEvents();
    let req = new Turno();
    req.NumeroPagina = 1;
    req.RegistrosPorPagina = 400;
    req.idEspecialista = this.profesionalSeleccionado;
    this.especialistaId = this.profesionalSeleccionado;
    this.obtenerTurnos(req);
    this.googleAnalyticsService.click("Dropdown profesionales");
  }
 
  public setEstablecimiento(): void {
    this.profesionalSeleccionado = null;
    this.profesionales = [];
    this.fullcalendar.getApi().removeAllEvents();
    this.loadProfesionales();
    this.profesionalDisabled = false;
    this.cleanForm();
    this.googleAnalyticsService.click("Dropdown establecimientos");
  }

  public tieneEstablecimientosDisponibles: boolean;
  private loadEstablecimientos(): void {
    let req = new Establecimiento();
    req.IdUsuario = this.authService.getUsuarioCredenciales().id;
    req.RegistrosPorPagina = 100;
    req.NumeroPagina = 1;
    this.suppliersService.obtenerEstablecimientosPaginados(req).then(response => {
      response.data.datos.forEach(element => {
        if(element.estaActivo && element.cantidadEspecialistas > 0) {
          this.tieneEstablecimientosDisponibles = true;
          this.establecimientos.push(element);
        } else {
          this.tieneEstablecimientosDisponibles = false;
        }
        if(!this.tieneEstablecimientosDisponibles) {
          this.callToast("Aun no posee establecimientos cargados y activos.", 4000, "infoToast");
        }
      }, 
      error => {
        this.callToast("Ocurrió un error al intentar obtener los establecimiento.", 4000, "errorToast");
      })});
      
      
  }

  private loadProfesionales(): void {
    this.suppliersService.obtenerEspecialistasPorIdEstablecimiento(this.establecimientoSeleccionado).then(data => {
      this.profesionales = data.data;
      this.isProfesionalesDisabled = false;
    }, error => {
      this.callToast(error.response.data.exception[0].detail, 3000, "warningToast");
      this.isProfesionalesDisabled = true;
    });
  }

  public isProfesionalesDisabled: boolean = false;

  public obtenerTurnos(req): void {
    this.sharedServices.obtenerTurnos(req).then(data => {
      this.parseoResponse(data.data.datos);
    }, error => {
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
      
    }, error => {
      
    });
  }

  public actualizarTurno(req): void {
    this.sharedServices.actualizarTurno(req).then(data => {
      
    }, error => {
      
    });
  }

  public finalizarTurno(req): void {
    this.sharedServices.finalizarTurno(req).then(data => {
      
    }, error => {
      
    });
  }

  public obtenerTurnoPorId(): void {
    let id;
    this.sharedServices.obtenerTurnoPorId(id).then(data => {
      
    }, error => {
      
    });
  }

  public cambioEstadoTurno(): void {
    let id;
    this.sharedServices.cambioEstadoTurno(id).then(data => {
      
    }, error => {
      
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
    for (const objeto of turnos) {
      let obj = {
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
        "respuestaTurno": objeto.respuestaTurno
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

  public settearCriterioDeBusqueda(criterio): void {
    this.puedeBuscar = true;
    this.criterioDeBusqueda = criterio;
  }

  public setValor(valor): void {
    this.valorDeBusqueda = valor.target.value;
  }

  public buscarMascota(): void {
    this.mascotasHabilitadas = false;
    if(this.criterioDeBusqueda == "num") {
      this.suppliersService.obtenerPacientesPorIdUsuarioCliente(parseInt(this.valorDeBusqueda)).then(data => {
        if(data.data.length > 0) {
          this.callToast(`Se encontraron ${data.data.filter(m => m.estaActivo == true).length} mascotas.`, 3000, "okToast");
          this.mascotas = data.data.filter(m => m.estaActivo == true);
          this.mascotasHabilitadas = true;
          this.mascotaSeleccionada = data.data[0];
        } else {
          this.callToast("No se encontró un usuario.", 3000, "warningToast");
        }
      }, error => {
        this.callToast("No se encontró un usuario.", 3000, "warningToast");
      });
    } else {
      this.suppliersService.obtenerPacientesPorUsuarioCliente(this.valorDeBusqueda).then(data => {
        if(data.data.length > 0) {
          this.callToast(`Se encontraron ${data.data.length} mascotas.`, 3000, "okToast");
          this.mascotas = data.data.filter(m => m.estaActivo == true);
          this.mascotasHabilitadas = true;
        }
      }, error => {
        this.callToast("No se encontró un usuario.", 3000, "warningToast");
      });
    }
  }

  public onActionCompleteHC(data: any): void {
    this.suppliersService.crearHistorialClinico(this.buildHCReq(data)).then(data => {
      this.callToast("Se completó el turno exitosamente.", 4000, "okToast");
      this.googleAnalyticsService.click("Creación historial clinico");
      this.refreshTurnos(this.especialistaId);
    }).catch(data => {
      this.callToast("Ocurrió un error.", 4000, "errorToast");
    });
  }

  private buildHCReq(data): HistorialClinico {
    let hc = new HistorialClinico();
    hc.historialClinicoTipoAntiparasitarios = data.dto.historialClinicoTipoAntiparasitarios;
    hc.historialClinicoEnfermedadesYDolencias = data.dto.historialClinicoEnfermedadesYDolencias;
    hc.historialClinicoTipoVacunas = data.dto.historialClinicoTipoVacunas;
    hc.historialClinicoTipoPracticas = data.dto.historialClinicoTipoPracticas;
    hc.idTurno = parseInt(this.temporalModel.idTurnoSeleccionado);
    hc.observaciones = data.descripcion;

    let q = new Date();
    q.setHours(q.getHours() - 3);
    hc.fechaEmision = q;
    hc.fechaModificacion = q;
    return hc;
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