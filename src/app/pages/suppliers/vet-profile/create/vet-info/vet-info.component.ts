import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Veterinaria } from "src/app/models/veterinaria.model";
import { SharedServices } from "src/app/services/sharedServices.shared";
import { SuppliersService } from "src/app/services/suppliers.service";
import { LoadingService } from "src/app/shared/loading/loading.service";

@Component({
    selector: 'vet-info',
    templateUrl: './vet-info.component.html',
    styleUrls: ['./vet-info.component.css']
})
export class VetInfoComponent implements OnInit {

    @Input()
    vet: Veterinaria;

    public mostrarCartel: boolean = false;

    public form: FormGroup;

    public mediosDePago: any[];

    public showError: boolean = false;

    @Output()
    public infoVet: EventEmitter<{}> = new EventEmitter<{}>();

    constructor(private cr: ChangeDetectorRef, private snackBar: MatSnackBar, private changeRef: ChangeDetectorRef, private formBuilder: FormBuilder, private loadingService: LoadingService, private suppliersService: SuppliersService, private sharedServices: SharedServices, private datePipe: DatePipe) {
    }

    public docs: any;

    ngOnInit(): void {
        this.buildForm();
    }

    private buildForm(): void {
        this.form = this.formBuilder.group({
            nombre: ['', Validators.required],
            idTipoDoc: ['', Validators.required],
            doc: ['', Validators.required]
        });
    }

    public close(): void {
        this.mostrarCartel = false;
        this.showError = false;
        this.form.clearValidators();
        this.form.reset();
    }

    currentDoc;

    public show(): void {
        this.sharedServices.getDocumentos().then(data => {
            this.docs = data.data;
            this.form.get('nombre').setValue(this.vet.nombreVet);
            this.form.get('idTipoDoc').setValue(this.docs.find(d => d.id == this.vet.documentoDescripcion));
            this.currentDoc = this.docs.find(d => d.id == this.vet.documentoDescripcion);
            let selectElement = document.getElementById('idTipoDoc') as HTMLSelectElement;
            this.currentDoc = this.docs.find(d => d.id).id;
            this.form.controls['doc'].setValue(this.vet.nrodoc);
            this.cr.detectChanges();
        });
        this.mostrarCartel = true;
        this.changeRef.detectChanges();
    }

    public confirm(): void {
        if (this.form.valid) {
            let request = {
                "nombre": this.form.controls["nombre"].value,
                "idTipoDoc": parseInt(this.form.controls["idTipoDoc"].value),
                "doc": this.form.controls["doc"].value,
                "fotoVeterinaria": this.base64FromChild
            };
            this.infoVet.emit(request);
            this.close();
        } else {
            this.showError = true;
        }
    }

    base64FromChild: string | undefined;

   public onBase64Ready(base64: string) {
    this.base64FromChild = base64.replace("data:image/png;base64,", "");
  }

  public formatError(): void {
    this.callToast("El formato de la imagen debe ser PNG.", 3000, "errorToast");
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