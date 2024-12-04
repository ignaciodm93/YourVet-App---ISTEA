import { Component, OnInit, ViewChild } from '@angular/core';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { SuppliersService } from '../../../../services/suppliers.service';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { formatearFecha } from 'src/app/pages/Utils/utils';
import { LoadingService } from 'src/app/shared/loading/loading.service';

@Component({
  selector: 'new-shift',
  templateUrl: './new-shift.component.html',
  styleUrls: ['./new-shift.component.css']
})
export class NewShiftComponent implements OnInit {

  @ViewChild(FullCalendarComponent) calendarComponent: FullCalendarComponent;

  @ViewChild(ModalComponent) modalComponent: ModalComponent;

  constructor(private suppliersService: SuppliersService, private loadingService: LoadingService) { }

  public modalTitle: string;

  ngOnInit(): void {
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    eventClick: this.handleDateClick.bind(this),
    events: [
      { "title": "08:00 Boby", "edate": "2023-11-01", "pet": "Boby", "owner": "Alice", "hour": "08:00", "reason": "Chequeo de rutina", "state": "pendiente", "color": this.setColorByState('pendiente') },
      { "title": "10:00 Lola", "date": "2023-11-03", "pet": "Lola", "owner": "Bob", "hour": "10:00", "reason": "Vacunación", "state": "aceptado", "color": this.setColorByState('aceptado') },
      { "title": "14:00 Choco", "date": "2023-11-05", "pet": "Choco", "owner": "Charlie", "hour": "14:00", "reason": "Cirugía", "state": "cancelado", "color": this.setColorByState('cancelado') },
      { "title": "08:00 Duke", "date": "2023-11-07", "pet": "Duke", "owner": "David", "hour": "08:00", "reason": "Chequeo de rutina", "state": "realizado", "color": this.setColorByState('realizado') },
      { "title": "10:00 Rocky", "date": "2023-11-09", "pet": "Rocky", "owner": "Eve", "hour": "10:00", "reason": "Vacunación", "state": "pendiente", "color": this.setColorByState('pendiente') },
      { "title": "14:00 Toby", "date": "2023-11-11", "pet": "Toby", "owner": "Frank", "hour": "14:00", "reason": "Cirugía", "state": "aceptado", "color": this.setColorByState('aceptado') },
      { "title": "08:00 Lola", "date": "2023-11-13", "pet": "Lola", "owner": "Alice", "hour": "08:00", "reason": "Chequeo de rutina", "state": "cancelado", "color": this.setColorByState('cancelado') },
      { "title": "10:00 Choco", "date": "2023-11-13", "pet": "Choco", "owner": "Bob", "hour": "10:00", "reason": "Vacunación", "state": "realizado", "color": this.setColorByState('realizado') },
      { "title": "14:00 Duke", "date": "2023-11-13", "pet": "Duke", "owner": "Charlie", "hour": "14:00", "reason": "Cirugía", "state": "pendiente", "color": this.setColorByState('pendiente') },
      { "title": "16:00 Daisy", "date": "2023-11-13", "pet": "Daisy", "owner": "David", "hour": "08:00", "reason": "Chequeo de rutina", "state": "aceptado", "color": this.setColorByState('aceptado') },
      { "title": "10:00 Rocky", "date": "2023-11-21", "pet": "Rocky", "owner": "Eve", "hour": "10:00", "reason": "Vacunación", "state": "cancelado", "color": this.setColorByState('cancelado') },
      { "title": "14:00 Toby", "date": "2023-11-23", "pet": "Toby", "owner": "Frank", "hour": "14:00", "reason": "Cirugía", "state": "realizado", "color": this.setColorByState('realizado') },
      { "title": "08:00 Lola", "date": "2023-11-25", "pet": "Lola", "owner": "Alice", "hour": "08:00", "reason": "Chequeo de rutina", "state": "pendiente", "color": this.setColorByState('pendiente') },
      { "title": "10:00 Choco", "date": "2023-11-27", "pet": "Choco", "owner": "Bob", "hour": "10:00", "reason": "Vacunación", "state": "aceptado", "color": this.setColorByState('aceptado') },
      { "title": "14:00 Duke", "date": "2023-11-29", "pet": "Duke", "owner": "Charlie", "hour": "14:00", "reason": "Cirugía", "state": "cancelado", "color": this.setColorByState('cancelado') },
      { "title": "08:00 Daisy", "date": "2023-12-01", "pet": "Daisy", "owner": "David", "hour": "08:00", "reason": "Chequeo de rutina", "state": "realizado", "color": this.setColorByState('realizado') },
      { "title": "10:00 Rocky", "date": "2023-12-03", "pet": "Rocky", "owner": "Eve", "hour": "10:00", "reason": "Vacunación", "state": "pendiente", "color": this.setColorByState('pendiente') },
      { "title": "14:00 Toby", "date": "2023-12-05", "pet": "Toby", "owner": "Frank", "hour": "14:00", "reason": "Cirugía", "state": "aceptado", "color": this.setColorByState('aceptado') }
    ]
  };

  private setColorByState(state: string): string {
    let bgColor;
    switch (state) {
      case "pendiente":
      bgColor = "#FFA500";
      break;
    case "aceptado":
      bgColor = "#008000";
      break;
    case "cancelado":
      bgColor = "#FF6347";
      break;
    case "realizado":
      bgColor = "#00BFFF";
      break;
    default:
    }
    return bgColor;
  }

  handleDateClick(data) {
    this.modalTitle = data.event.extendedProps.pet + " " + data.event.extendedProps.hour + "hs";
    this.modalComponent.modalTitle = data.event.extendedProps.pet + ", " + data.event.extendedProps.hour + "hs";
    this.modalComponent.modalSubtitle = "Motivo de consulta: " + data.event.extendedProps.reason;
    this.modalComponent.arrayList = [
      `Fecha y hora: ${formatearFecha(data.event.startStr)}`,
      //`Dueño: ${data.event.extendedProps.owner}`, corregir luego dependiendo del id que se ingrese
      `Dueño: 'Victoria'`,
      `Estado del turno: ${data.event.extendedProps.state}`,
    ];
    this.modalComponent.show();
  }

  public showDayView(): void {
    const calendarApi: Calendar = this.calendarComponent.getApi();
    calendarApi.changeView('dayGridDay', '2023-11-13');
  }

  public onConfirmModal(): void{
    this.loadingService.show();
    this.showDayView();
    setTimeout(() => {
      this.loadingService.hide();
    }, 250);
  }

 
}