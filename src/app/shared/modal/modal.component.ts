import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { isNotNullAndNotUndefined } from 'src/app/pages/Utils/utils';
import { SharedServices } from 'src/app/services/sharedServices.shared';

@Component({
    selector: 'modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

    @Input()
    public showModal: boolean = false;
    @Input()
    public modalTitle: string;
    @Input()
    public cancelTxt: string;
    @Input()
    public confirmTxt: string;
    @Input()
    public modalSubtitle: string;
    @Input()
    public modalTxt: string;
    @Output()
    public onConfirm = new EventEmitter<void>;
    @Input()
    public arrayList: string[];
    @Input()
    public hasFirstBtn: boolean = true;
    @Input()
    public hasSecondBtn: boolean = true;
    @Input()
    public actionFsTxt: string;
    @Input()
    public actionScTxt: string;
    @Output()
    public onAction = new EventEmitter<string>;
    @Input()
    public showInputText = false;
    @Input()
    public isSuccessDisabled = false;
    @Output()
    public onActionComplete = new EventEmitter<{}>;
    @Input()
    public extraClass: string;
    
    vacunasAplicadas: any[] = [];
    practicasAplicadas: any[] = [];
    antiparasitariosAplicados: any[] = [];

    @Input()
    vacunasList: any[];

    @Input()
    practicasList: any[];

    @Input()
    antiparasitariosList: any[];
  

    mostrarCartel: boolean = false;

    constructor(private sharedServices: SharedServices, private changeRef: ChangeDetectorRef) { }

    ngOnInit(): void { }

    public close(): void {
        this.mostrarCartel = false;
    }

    public show(): void {
        this.mostrarCartel = true;
    }

    public confirm(): void {
        this.close();
        this.onConfirm.emit();
    }

    public action(action: string): void {
        this.close();
        this.showInputText = false;
        this.onAction.emit(action);
        this.eraseMsg();
    }

    public chequearInput(texto): void {
        if(isNotNullAndNotUndefined(texto.target.value) && texto.target.value.length > 5) {
            this.isSuccessDisabled = false;
            this.sharedServices.updateText(texto.target.value);
        } else {
            this.isSuccessDisabled = true;
        }
    }

    public actionComplete(data): void {
        this.close();
        this.showInputText = false;
        let obj = {};
        obj['descripcion'] = (document.getElementById("descripcion") as HTMLInputElement).value;
        obj['action'] = "Completar";
        this.setChecks(obj);
        this.onActionComplete.emit(obj);
        this.eraseMsg();
    }

    private eraseMsg(): void {
        if(isNotNullAndNotUndefined((document.getElementById("descripcion") as HTMLInputElement).value)) {
            (document.getElementById("descripcion") as HTMLInputElement).value = "";
        }
    }

    @Input()
    set setInputText(value) {
        this.showInputText = value;
        this.changeRef.detectChanges();
    }

    public agregarVacuna(val): void {
        this.vacunasAplicadas.push(val);
    }

    public agregarPractica(val): void {
        this.practicasAplicadas.push(val);
    }

    public agregarAntiparasitario(val): void {
        this.antiparasitariosAplicados.push(val);
    }

    private setChecks(obj): void {
        if(this.antiparasitariosAplicados.length > 0) {
            obj['antiparasitarios'] = [];
            this.antiparasitariosAplicados.forEach(element => {
                obj['antiparasitarios'].push(element);
            });
        }
        if(this.practicasAplicadas.length > 0) {
            obj['practicas'] = [];
            this.practicasAplicadas.forEach(element => {
                obj['practicas'].push(element);
            });
        }
        if(this.vacunasAplicadas.length > 0) {
            obj['vacunas'] = [];
            this.vacunasAplicadas.forEach(element => {
                obj['vacunas'].push(element);
            });
        }
    }
}
