import { DatePipe } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Establecimiento } from "src/app/models/sucursal.model";
import { AuthService } from "src/app/services/auth.service";
import { SharedServices } from "src/app/services/sharedServices.shared";
import { SuppliersService } from "src/app/services/suppliers.service";
import { LoadingService } from "src/app/shared/loading/loading.service";

@Component({
    selector: 'new-local',
    templateUrl: './new-local.component.html',
    styleUrls: ['./new-local.component.css']
})
export class NewLocalComponent implements OnInit {

    public mostrarCartel: boolean = false;

    public form: FormGroup;

    public mediosDePago: any[];

    public showError: boolean = false;

    @Output()
    public onCreateLocal = new EventEmitter<void>;
    
    public showErrorOnCreate: boolean = false;

    constructor(private formBuilder: FormBuilder, private loadingService: LoadingService, private suppliersService: SuppliersService, private sharedServices: SharedServices, private datePipe: DatePipe, private authService: AuthService, private snackBar: MatSnackBar) {
    }

    public localidades: any;
    ngOnInit(): void {
        this.sharedServices.getLocalidades().then(data => {
            this.localidades = data.data;
        });
        this.buildForm();
    }

    private buildForm(): void {
        this.form = this.formBuilder.group({
            calle: ['', Validators.required],
            numero: ['', Validators.required],
            codigoPostal: ['', Validators.required],
            departamento: ['', null],
            piso: ['', null],
            idTipoLocalidad: ['', Validators.required]
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
        this.showErrorOnCreate = false;
        if (this.form.valid) {
            let request = new Establecimiento();
            request.calle = this.form.get('calle').value;
            request.codigoPostal = this.form.get('codigoPostal').value;
            request.departamento = this.form.get('departamento').value;
            request.direccionCompleta = true;
            request.fechaCreacion = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSSZ');
            request.fechaModificacion = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSSZ');
            request.idUsuarioVeterinaria = this.authService.getUsuarioCredenciales().id;
            request.numero = this.form.get('numero').value;
            request.piso = this.form.get('piso').value;
            request.idTipoLocalidad = this.form.get('idTipoLocalidad').value;
            request.sucursal = 1; //camiar por input
            request.estaActivo = true;
            this.loadingService.show();
            this.suppliersService.crearEstablecimiento(request).then(data => {
                // debugger
                this.callToast("Se registró el establecimiento exitosamente", 4000, "okToast");
                this.onCreateLocal.emit();
                this.close();
                // this.callToast("Se creó la sucursal exitosamente", 3000, "okToast");
            }, error => {
                this.showErrorOnCreate = true;
                this.callToast("Ocurrió un error al intentar crear la sucursal", 3000, "errorToast");
            }).finally(() => this.loadingService.hide());        
        } else {
            this.showError = true;
        }
    }

    setExtraValidationForPayments(mediosDePago): any {
        return (formGroup: FormGroup) => {
          const selectedMediosDePago = mediosDePago
            .map(medioPago => formGroup.get(medioPago.value).value)
            .some(value => value === true);
    
          return selectedMediosDePago ? null : { atLeastOneMedioPagoRequired: true };
        };
      }

      checkOnlyNumbers(control: FormControl): { [key: string]: any } | null {
        const valid = /^\d+$/.test(control.value);
    
        return valid ? null : { 'onlyNumbers': true };
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