import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MainContentComponent } from './main-content/main-content.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { LoadingComponent } from './loading/loading.component';
import { LoadingService } from './loading/loading.service';
import { ModalComponent } from './modal/modal.component';
import { InfoComponent } from './info/info.component';
import { Pagina404Component } from './pagina404/pagina404.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MainTableComponent } from './main-table/main-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ContactanosComponent } from './contactanos/contactanos.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBadgeModule } from '@angular/material/badge';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    MainContentComponent,
    SidebarComponent,
    LoadingComponent,
    ModalComponent,
    InfoComponent,
    Pagina404Component,
    MainTableComponent,
    ContactanosComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatOptionModule,
    MatSelectModule,
    MatFormFieldModule,
    MatBadgeModule,
    NgxChartsModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    MainContentComponent,
    SidebarComponent,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    LoadingComponent,
    ModalComponent,
    Pagina404Component,
    MatMenuModule,
    MatIconModule,
    MainTableComponent,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    NgxChartsModule
  ]
})
export class SharedModule { }
