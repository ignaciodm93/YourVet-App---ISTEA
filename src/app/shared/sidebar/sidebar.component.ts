import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GoogleAnalyticsService } from 'src/app/pages/Utils/google-analytics.service';
import { isNotNullAndNotUndefined } from 'src/app/pages/Utils/utils';
import { AuthService } from 'src/app/services/auth.service';
import { ClientService } from 'src/app/services/client.service';
import { SharedServices } from 'src/app/services/sharedServices.shared';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input()
  public userType: string;

  @Output()
  public onRedirect = new EventEmitter<string>;

  @Input()
  public notificationCount: number = null;

  userName: string;

  constructor(private loadingService: LoadingService, private snackBar: MatSnackBar, private ref: ChangeDetectorRef, private sharedServices: SharedServices, private clientsService: ClientService, private suppliersService: SuppliersService, private router: Router, private authService: AuthService, private googleAnalyticsService: GoogleAnalyticsService) { }

  async ngOnInit() {
    this.userName = this.authService.getUsuarioCredenciales().nombreUsuario;
    this.sharedServices.notifications$.subscribe(async () => {
      this.loadingService.show();
      await this.checkNotifications();
      this.loadingService.hide();
    });
    this.sharedServices.updateNotifications();
  }

  private async checkNotifications() {
    if (this.authService.getUsuarioCredenciales().esCliente) {
      await this.clientsService.notificacionesCli(this.buildReq()).then(data => {
          this.notificationCount = data.data.datos.filter(n => n.notificacionVista == false).length;
          this.sinNotificaciones();
          this.ref.detectChanges();
      }).catch(err => {
        // debugger;
      });
    } else {
      this.suppliersService.notificacionesVet(this.buildReq()).then(data => {
          this.notificationCount = data.data.datos.filter(n => n.notificacionVista == false).length;
          this.sinNotificaciones();
          this.ref.detectChanges();
      }).catch(err => {
      });
    }
  }

  private sinNotificaciones() {
    if (this.notificationCount == 0 && (this.router.url == "/suppliers/notifications" || this.router.url == "/client/notificaciones")) {
      this.callToast("No tenés notificaciones pendientes.", 4000, "infoToast");
      this.notificationCount = null;
    } else if (this.notificationCount == 0) {
      this.notificationCount = null;
    }
  }

  buildReq(): any {
    return {
      'RegistrosPorPagina': 200,
      'NumeroPagina': 1,
      'IdUsuario': this.authService.getUsuarioCredenciales().id
    }
  }

  public redirect(destination: string): void {
    this.googleAnalyticsService.click(destination);
    destination != "logout" ? this.onRedirect.emit(destination): this.logout();   
  }

  public logout(){
    sessionStorage.clear()
    this.router.navigate(["/home"])
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
}
