import { DatePipe } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Profesional } from "src/app/models/profesional.model";
import { Establecimiento } from "src/app/models/sucursal.model";
import { AuthService } from "src/app/services/auth.service";
import { SharedServices } from "src/app/services/sharedServices.shared";
import { SuppliersService } from "src/app/services/suppliers.service";
import { LoadingService } from "src/app/shared/loading/loading.service";

@Component({
    selector: 'new-profesional',
    templateUrl: './new-profesional.component.html',
    styleUrls: ['./new-profesional.component.css']
})
export class NewProfesionalComponent implements OnInit {

    public mostrarCartel: boolean = false;

    public form: FormGroup;

    public mediosDePago: any[];

    public showError: boolean = false;

    public establecimientos: Establecimiento [];

    @Output()
    public onCreateProfessional = new EventEmitter<number>;
    @Output()
    public onCreateError = new EventEmitter<string>;

    constructor(private authService: AuthService, private formBuilder: FormBuilder, private loadingService: LoadingService, private suppliersService: SuppliersService, private sharedServices: SharedServices, private datePipe: DatePipe, private snackBar: MatSnackBar) {
    }

    public practicas: any;
    public docs: any;
    public especialidades: any;
    ngOnInit(): void {
        this.sharedServices.getEspecialidad().then(data => {
            this.especialidades = data.data;
        });
        this.obtenerEstablecimientos();
        this.buildForm();
    }

    private obtenerEstablecimientos() {
        let req = new Establecimiento();
    req.IdUsuario = this.authService.getUsuarioCredenciales().id;
    req.NumeroPagina = 1;
    req.RegistrosPorPagina = 10;
    this.suppliersService.obtenerEstablecimientosPaginados(req).then(response => {
      this.establecimientos = response.data.datos;
    }).catch(error => {
        //this.sinEstablecimientos.emit(true);
        // this.callToast(error.response.data.exception[0].detail, 3000, "infoToast");
    });
    }

    private buildForm(): void {
        this.form = this.formBuilder.group({
            nombre: ['', Validators.required],
            apellido: ['', Validators.required],
            // idTipoEspecilidad: ['', Validators.required],
            establecimiento: ['', Validators.required],
            especialidad: ['', Validators.required],
            matricula: ['', Validators.required]
        });
    }

    public close(): void {
        this.mostrarCartel = false;
        this.showError = false;
        this.form.clearValidators();
        this.form.reset();
    }

    public show(): void {
        this.mostrarCartel = true;
    }

    public confirm(): void {
        if (this.form.valid) {
            let request = new Profesional();
            request.nombre = this.form.get('nombre').value;
            request.apellido = this.form.get('apellido').value;
            request.matricula = this.form.get('matricula').value;
            request.estaActivo = true;
            request.idTipoEspecialidad = parseInt(this.form.get('especialidad').value);
            request.idUsuarioVeterinaria = this.authService.getUsuarioCredenciales().id;
            request.idEstablecimiento = parseInt(this.form.get('establecimiento').value);
            this.suppliersService.crearEspecialista(request).then(data => {
                this.close();
                this.onCreateProfessional.emit(request.idEstablecimiento);
                this.callToast("Se creó al especialista " + request.nombre + " " + request.apellido, 3000, "okToast");
            }, error => {
                this.callToast("Ocurrió un error al intentar crear especialista ", 3000, "errorToast");
            })
        } else {
            this.showError = true;
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

    public reloadEstablecimientos(): void {
        if (this.establecimientos == undefined || this.establecimientos == null || this.establecimientos.length == 0) {
            this.obtenerEstablecimientos();
        }
    }
}