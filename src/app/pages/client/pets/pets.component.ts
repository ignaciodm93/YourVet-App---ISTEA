import { animate, query, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Archivo } from 'src/app/models/archivo.model';
import { Mascota } from 'src/app/models/mascota.model';
import { AuthService } from 'src/app/services/auth.service';
import { ClientService } from 'src/app/services/client.service';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { LoadingService } from 'src/app/shared/loading/loading.service';
import { isNotNullAndNotUndefined } from '../../Utils/utils';
import { GoogleAnalyticsService } from '../../Utils/google-analytics.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.css','./pets.component2.css'],

})
export class PetsComponent implements OnInit {

editPets=false
viewData=false 
File:string 
petsArray:Mascota[]=[];
mascota:Mascota=new Mascota()
selectedPets: Mascota=new Mascota()
public petsList: any[]=[];
public arrImg:string[]=[]
public archivo:Archivo
public form!: FormGroup;
  data: any;
private petIdForEdit: number;

constructor( private readonly fb:FormBuilder, 
   private sanitizer:DomSanitizer, 
   private clientService: ClientService, 
   private router: Router,
   private loadingService: LoadingService,
   private route:ActivatedRoute,
   private authService:AuthService,
   private suppliersService: SuppliersService,
   private cr: ChangeDetectorRef,
   private googleAnalyticsService: GoogleAnalyticsService, 
   private snackBar: MatSnackBar) { }

ngOnInit(): void {
  if(!this.data){
    this.data=this.authService.getUsuarioCredenciales();
  }

  this.suppliersService.obtenerPacientesPorIdUsuarioCliente(this.authService.getUsuarioCredenciales().id).then(data => {
    this.petsArray = data.data;
    this.clientService.updateMyPets(this.petsArray);
  });
}

public irATurnos(): void {
  this.router.navigate(['client/turn']);
}



/************************************************************/ 
public OpenForEdit(p:Mascota):void{
  this.googleAnalyticsService.click("Selección de mascota");
  this.selectedPets=p
  this.viewData=true
  this.petIdForEdit = p.id;
  // this.cr.detectChanges();
}
  
/************************************************************/
deletePet() {
 // this.clientService.delete(this.selectedPets.id).subscribe(()=>{
//  const temArr=this.petsArray.filter(p => p.id !== this.selectedPets.id)
 // this.petsArray=[...temArr]
  this.selectedPets=this.mascota
  this.viewData=false
//})
this.clientService.cambiarEstadoPacienteId(this.petIdForEdit).then(data => {
  this.callToast("Se dió de baja la mascota exitosamente.", 4000, "okToast");
  this.refresh();
  }).catch(error => {
    debugger
  });

}

/************************************************************/
public cancelPet():void{
   // this.viewData=false
   // this.selectedPets=this.mascota
}

public newShifts():void{
 // console.log("entre")
  //this.router.navigate(['client/turn',this.selectedPets.id]);
}





/************************************************************/
public fileEvent(fileinput:Event):void{
  const file=(<HTMLInputElement>fileinput.target).files[0]
  this.extraerBase64(file).then((image:any)=>{
  this.selectedPets.image=image.base
})
 
  //if(file.type==='image/jpeg' || file.type=='image/png'){
  //var json=JSON.stringify(this.archivo)
 // var header=new HttpHeaders().set("content-type","application/jason")
 //   console.log(json)
 //   console.log(json)
 // }
  
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

public newPet(): void {
  this.googleAnalyticsService.click("Nueva mascota");
  this.router.navigate(['client/new-pet']);

}

public editPet():void{
  this.googleAnalyticsService.click("Editar mascota");
 this.router.navigate(['client/detail-pet',this.selectedPets.id]);
}

public setImg(atributoFoto): string {
  if (isNotNullAndNotUndefined(atributoFoto)) {
    return atributoFoto;
  } else {
    return "../../../../assets/images/pet_default.png";
  }
}

public isPetSelected(): boolean {
  this.googleAnalyticsService.click("Selección de mascota");
  return isNotNullAndNotUndefined(this.petIdForEdit) ? true : false;
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

public activar(): void {
  this.clientService.cambiarEstadoPacienteId(this.selectedPets.id).then(data => {
    this.callToast("Se activó la mascota exitosamente.", 5000, "okToast");
    this.refresh();
  });
}


  private refresh() {
    this.suppliersService.obtenerPacientesPorIdUsuarioCliente(this.authService.getUsuarioCredenciales().id).then(data => {
      this.petsArray = data.data;
      if (this.selectedPets.estaActivo) {
        this.selectedPets.estaActivo = false;
      } else {
        this.selectedPets.estaActivo = true;
      }
      this.clientService.updateMyPets(this.petsArray);
      this.cr.detectChanges();
    });
  }
}
