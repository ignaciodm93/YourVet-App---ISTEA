import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { VetProfileComponent } from './suppliers/vet-profile/vet-profile.component';
import { VetsComponent } from './suppliers/vets/vets.component';
import { ShiftsComponent } from './suppliers/shifts/shifts.component';
import { PagesRoutingModule } from './pages-routing.module';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientComponent } from './client/client.component';
import { PetsComponent } from './client/pets/pets.component';
import { ShiftscComponent } from './client/shiftsc/shiftsc.component';
import { UserComponent } from './client/user/user.component';
import { TestComponent } from './suppliers/testme/testme.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NewShiftComponent } from './suppliers/shifts/new/new-shift.component';
import { AuthModule } from '../auth/auth.module';
import { NewLocalComponent } from './suppliers/vet-profile/create/new-local/new-local.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { NewProfesionalComponent } from './suppliers/vet-profile/create/new-profesional/new-profesional.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { VetInfoComponent } from './suppliers/vet-profile/create/vet-info/vet-info.component';
import { NewPetComponent } from './client/pets/new-pet/new-pet.component';
import { DetailPetComponent } from './client/pets/detail-pet/detail-pet.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import {MatBadgeModule} from '@angular/material/badge';
import { NotificacionesComponent } from './client/notificaciones/notificaciones.component';
import { ConfirmationModalComponent } from './suppliers/shifts/confirmation-modal/confirmation-modal';
import { DashboardComponent } from './suppliers/dashboard/dashboard.component';
import { PetHistoryComponent } from './client/medical-history-client/pet-history-client.component';
import { MedicalHistoryComponent } from './suppliers/medical-history/medical-history.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DropzoneComponent } from './Utils/dragzone/dropzone.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SettingComponent } from './client/setting/setting.component';
import { NotificacionesVetComponent } from './suppliers/notifications-vet/notifications-vet.component';
import { UpdateUserComponent } from './client/user/update-user/update-user.component';

@NgModule({
  declarations: [
    HomeComponent,
    VetProfileComponent,
    PetHistoryComponent,
    VetsComponent,
    ShiftsComponent,
    SuppliersComponent,
    ClientComponent,
    PetsComponent,
    ShiftscComponent,
    UserComponent,
    TestComponent,
    NewShiftComponent,
    NewLocalComponent,
    NewProfesionalComponent,
    VetInfoComponent,
    NewPetComponent,
    DetailPetComponent,
    NotificacionesComponent,
    ConfirmationModalComponent,
    DashboardComponent,
    MedicalHistoryComponent,
    DropzoneComponent,
    SettingComponent,
    NotificacionesVetComponent,
    UpdateUserComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PagesRoutingModule,
    FormsModule,
    FullCalendarModule,
    AuthModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule, 
    MatSelectModule,
    MatOptionModule,
    MatBadgeModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatPaginatorModule
  ],
  exports:[
    HomeComponent
  ]
})
export class PagesModule { }
