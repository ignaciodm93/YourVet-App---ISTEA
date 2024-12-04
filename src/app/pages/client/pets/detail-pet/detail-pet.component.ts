import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Mascota } from 'src/app/models/mascota.model';
import { isNotNullAndNotUndefined } from 'src/app/pages/Utils/utils';
import { ClientService } from 'src/app/services/client.service';
import { SharedServices } from 'src/app/services/sharedServices.shared';
import { LoadingService } from 'src/app/shared/loading/loading.service';






@Component({
  selector: 'app-detail-pet',
  templateUrl: './detail-pet.component.html',
  styleUrls: ['./detail-pet.component.css']
})
export class DetailPetComponent implements OnInit {

id!:number
file!:string
name!:string
mascota: Mascota=new Mascota()






public razas:any[] = [];

  public arrprueba: any[]=[];
  pacienteform:FormGroup
  rastreado: boolean;
  constructor(
    private readonly fb:FormBuilder, 
    private sanitizer:DomSanitizer, 
    private clientService: ClientService, 
    private readonly router:  Router,
    private loadingService: LoadingService, 
    private route:ActivatedRoute,
    private cf: ChangeDetectorRef,
    private ss: SharedServices,
    private snackBar: MatSnackBar
    ) {
      this.pacienteform = this.fb.group({
      id:[''],
      image:[''],
      name:['',[Validators.required,Validators.minLength(3)]],
      raza:['',[Validators.required]],
      color:['',[Validators.required,Validators.minLength(3)]],
      genero:['',[Validators.required,Validators.minLength]],
      fechanacimiento:['',[Validators.required]],
      esterilizado:['',[]],
      adoptado:['',[Validators.required]],
      chiprastreo:['',[]],
      specie:['',[Validators.required]]
       
})



     }

  ngOnInit(): void {
    this.route.params.subscribe((params:Params)=>{
      this.id = params['id'];

      this.clientService.obtenerPacientePorId(this.id).then(data => {
        this.fillForm(data.data);
      });

    }) 


    this.ss.getRaza().then(data => {
      this.razas = data.data;
    })

  }

  @ViewChild('idSexo', { static: false }) generoInput: ElementRef;

  currentImg: string = null;

  fillForm(data: any) {
    this.mascota = data;
    // this.cf.detectChanges();
    this.mascota.fechaNacimiento = this.parseDate(data.fechaNacimiento);
    // this.isMale = this.mascota.idSexo === 1;
    this.mascota.fotoPacienteBase64 = data.fotoPerfilBase64;

    this.esterilizadoFormControl.setValue(this.mascota.estaCastrado);
this.chipRastreoFormControl.setValue(this.mascota.chipRastreo);
    this.cf.detectChanges();
  }


  isMale: boolean;
  public pets(): void {
    this.router.navigate(['client/pets']);
  }


  parseDate(input: string): string {
    const fecha = new Date(input);
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  
public cancelPets() {
  this.router.navigate(['client/pets']);
}

generoFormControl = new FormControl('', Validators.required);
public editPet() {
// this.mascota.chipRastreo = this.mascota.chipRastreo.toString() == "true" ? true : false;
this.mascota.fotoPaciente = this.newImg;


this.clientService.actualizarPaciente(this.mascota).then(data => {
  this.callToast("Se actualizó el paciente " + this.mascota.nombre + " con éxito", 4000, "okToast");
  this.cancelPets();
}).catch(e => {
  this.callToast("Ocurrió un error al intentar actualizar la mascota", 3000, "errorToast");
});
}

chipRastreoFormControl = new FormControl(null, Validators.required);
esterilizadoFormControl = new FormControl(null, Validators.required);


  public fileEvent(fileinput:Event):void{
    const file=(<HTMLInputElement>fileinput.target).files[0]
    this.extraerBase64(file).then((image:any)=>{
    this.file=image.base
    console.log(this.file)
   
})
   
    
}
  

extraerBase64 = async($event:any)=> new Promise((resolve,reject)=>{
    try{
        const unsafeImg=window.URL.createObjectURL($event);
        const image=this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
        const reader= new FileReader();
        reader.readAsDataURL($event);
              reader.onload=()=>{
                        resolve({
                          base:reader.result
                        })
              }
              reader.onerror=error =>{
                        resolve({
                          base:null
                        });
              };
       }catch(e){
         return null;
                }
})

public getRaza(d): any {
  return this.razas.find(a => (a == d));
}

private getCH(d): boolean {
 return d.toString() == "true" ? true : false;
}
base64FromChild: string | undefined;
newImg: string | undefined;

public onBase64Ready(base64: string) {
  this.base64FromChild = base64.replace("data:image/png;base64,", "");
  // this.mascota.fotoPacienteBase64 = base64;
  //this.mascota.perfilBase64 = base64;
  this.newImg = base64.replace("data:image/png;base64,", "");
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

public setSex(ind): void {
  this.mascota.idSexo = ind;
}

public setChip(option): void {
  const currentOption = this.pacienteform.get('chiprastreo')?.value;
  // this.rastreado = !this.mascota.chipRastreo;
  // Cambia la selección solo si el usuario hace clic en una opción diferente
  // if (currentOption !== option) {
  //   this.pacienteform.patchValue({
  //     option,
  //   });
  // }
  this.mascota.chipRastreo = option;
}

public setEst(option): void {
  const currentOption = this.pacienteform.get('esterilizado')?.value;
// this.castrado = !this.mascota.estaCastrado;
    // Cambia la selección solo si el usuario hace clic en una opción diferente
    // if (currentOption !== option) {
    //   this.pacienteform.patchValue({
    //     option,
    //   });
    // }
    this.mascota.estaCastrado = option;
}
}
  


