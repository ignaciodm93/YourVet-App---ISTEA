import { RouterModule, Routes } from '@angular/router';
import { ShiftsComponent } from './suppliers/shifts/shifts.component';
import { VetsComponent } from './suppliers/vets/vets.component';
import { NgModule } from '@angular/core';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { MedicalHistoryComponent } from './suppliers/medical-history/medical-history.component';
import { ClientComponent } from './client/client.component';
import { VetProfileComponent } from './suppliers/vet-profile/vet-profile.component';
import { NewShiftComponent } from './suppliers/shifts/new/new-shift.component';
import { PetsComponent } from './client/pets/pets.component';
import { ShiftscComponent } from './client/shiftsc/shiftsc.component';
import { UserComponent } from './client/user/user.component';
import { TestComponent } from './suppliers/testme/testme.component';
import { SettingComponent } from './client/setting/setting.component';
import { NewPetComponent } from './client/pets/new-pet/new-pet.component';
import { DetailPetComponent } from './client/pets/detail-pet/detail-pet.component';
import { NotificacionesComponent } from './client/notificaciones/notificaciones.component';
import { DashboardComponent } from './suppliers/dashboard/dashboard.component';
import { NotificacionesVetComponent } from './suppliers/notifications-vet/notifications-vet.component';
import { UpdateUserComponent } from './client/user/update-user/update-user.component';

export const pagesRoutes: Routes = [
  {
    path: 'suppliers',
    component: SuppliersComponent,
    children: [
      {
        path: '',
        component: ShiftsComponent,
      },
      {
        path: 'vets',
        component: VetsComponent,
      },
      {
        path: 'shifts',
        component: ShiftsComponent,
      },
      {
        path: 'vet-profile',
        component: VetProfileComponent,
      },
      {
        path: 'medical-history',
        component: MedicalHistoryComponent,
      },
      {
        path: 'new-shift',
        component: NewShiftComponent,
      },
      {
        path: 'test',
        component: TestComponent
      },
      {
        path:'vet-dasboard',
        component: DashboardComponent
      },
      {
        path:'notifications',
        component: NotificacionesVetComponent
      }
    ],
  },
  {
    path: 'client',
    component: ClientComponent,
    children: [
      {
        path: '',
        component: PetsComponent
      },
      {
        path: 'pets',
        component: PetsComponent
      },
      {
        path: 'turn',
        component: ShiftscComponent
      },
      {
        path: 'turn/:id',
        component: ShiftscComponent
      },
      {
        path: 'user',
        component: UserComponent
      },
      {
        path: 'update-user',
        component: UpdateUserComponent
      },
      {
        path: 'setting',
        component: SettingComponent
      },
      {
        path:'new-pet',
        component:NewPetComponent
      },
      {
        path:'detail-pet/:id',
        component:DetailPetComponent
      },
      {
        path:'notificaciones',
        component: NotificacionesComponent
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(pagesRoutes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }