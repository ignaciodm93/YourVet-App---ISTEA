import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { parse } from 'date-fns';
import { Archivo } from 'src/app/models/archivo.model';
import { Mascota } from 'src/app/models/mascota.model';
import { GoogleAnalyticsService } from 'src/app/pages/Utils/google-analytics.service';
import { isNotNullAndNotUndefined } from 'src/app/pages/Utils/utils';
import { AuthService } from 'src/app/services/auth.service';
import { ClientService } from 'src/app/services/client.service';
import { SharedServices } from 'src/app/services/sharedServices.shared';
import { LoadingService } from 'src/app/shared/loading/loading.service';

@Component({
  selector: 'app-new-pet',
  templateUrl: './new-pet.component.html',
  styleUrls: ['./new-pet.component.css']
})
export class NewPetComponent implements OnInit {

petPhoto: string;

Modelo={
  Image:"",
  Nombre: "",
  IdUsuarioCliente: 0,
  IdTipoAnimalTipoRaza: "",
  TipoAnimal:"",
  Color: "",
  IdSexo: "",
  EstaCastrado: "",
  ChipRastreo: "",
  FechaNacimiento: "",
  FechaModificacion: "",
  FechaCreacion: "",
}
  idUsuario:number
  petsArray:Mascota[]=[];
  mascota: Mascota=new Mascota()
  file!:string;
  public arrSexo:any[]=[]
  public arrRazas:any[]=[]
  public arrtipoanimal:any[]=[]
  data: any;


constructor( private readonly fb:FormBuilder, 
              private sanitizer:DomSanitizer, 
              private clientService: ClientService, 
              private router:  Router,
              private loadingService: LoadingService,
              private sharedService: SharedServices,
              private authService:AuthService,
              private snackBar: MatSnackBar,
              private googleAnalyticsService: GoogleAnalyticsService
              ) 
              {}

ngOnInit(): void {

  this.sharedService.getRaza().then(data =>{
   this.arrRazas=data.data
 })
 
  if(!this.data){ 
    this.data=this.authService.getUsuarioCredenciales()
  }

  this.sharedService.getTipoanimal().then(data =>{
    // debugger
    this.arrtipoanimal=data.data;
  })
}

/**************************add Pet**********************************/
public addPet():void{
  if(this.file){
    this.mascota.image=this.file
  }else if(this.mascota.image==="" ){
    this.mascota.image="https://img.freepik.com/vector-premium/silueta-negra-perro-gato_566661-6118.jpg?w=740"
  
  }
let fechaCreacion=new Date()

this.mascota.nombre=this.Modelo.Nombre

if(this.Modelo.IdSexo=='true'){
  this.mascota.idSexo=1
}
else{
  this.mascota.idSexo=0
}
if(this.Modelo.EstaCastrado=='true'){
  this.mascota.estaCastrado=true
}
else{
  this.mascota.estaCastrado=false
}

if(this.Modelo.ChipRastreo=='true'){
  this.mascota.chipRastreo=true
}
else{
  this.mascota.chipRastreo=false
}

this.mascota.idTipoAnimalTipoRaza=parseInt(this.Modelo.IdTipoAnimalTipoRaza ,10)
this.mascota.idUsuarioCliente= this.authService.getUsuarioCredenciales().id;
this.mascota.color=this.Modelo.Color
this.mascota.estaActivo=true
this.mascota.fechaNacimiento=this.Modelo.FechaNacimiento
this.mascota.fechaModificacion=fechaCreacion
this.mascota.fechaCreacion=fechaCreacion
debugger
  let paciente={
    'id':this.mascota.id=0,//
    'nombre':this.mascota.nombre,//
    'idUsuarioCliente':this.authService.getUsuarioCredenciales().id,
    "idTipoAnimalTipoRaza": this.mascota.idTipoAnimalTipoRaza,
    'color':this.mascota.color,
    'idSexo':this.sex,
    'estaCastrado':this.mascota.estaCastrado,
    'chipRastreo':this.mascota.chipRastreo,
    'FechaNacimiento': this.mascota.fechaNacimiento,
    'fechaCreacion': this.mascota.fechaCreacion,
    'fechaModificacion':this.mascota.fechaModificacion,
    'estaActivo':this.mascota.estaActivo,
    'rutaFotoPerfil': this.base64FromChild
  }

  this.clientService.crearPaciente(paciente).then(res =>{
  this.router.navigate(['client/pets']);
  this.googleAnalyticsService.click("Registro de mascota");
  this.callToast("Se registró a " + paciente.nombre + " exitosamente.", 3000, 'okToast');
  }, error => {
    if(isNotNullAndNotUndefined(error.response.data.exception)) {
      error.response.data.exception.forEach(err => {
        this.callToast(err.detail, 3000, 'errorToast');
      });
    } else if (isNotNullAndNotUndefined(error.response.data.errors)) {
      error.response.data.errors.forEach(er => {
        er
        debugger
      });
    }
  }) 
  
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

/***************************back*********************************/
public cancelPets():void{   
  this.router.navigate(['client/pets']);
}
  
/***************************back*********************************/

public pets(): void {
  this.router.navigate(['client/pets']);
}

/************************************************************/

public fileEvent(fileinput:Event):void{
  debugger;
  if(!this.isPNG(fileinput.target)) {
    this.callToast("El formato debe ser PNG.", 4000, 'errorToast');
  } else {
    const file=(<HTMLInputElement>fileinput.target).files[0]
    this.extraerBase64(file).then((image:any)=>{
    this.file=image.base
  });
}
   
    //if(file.type==='image/jpeg' || file.type=='image/png'){
    //var json=JSON.stringify(this.archivo)
   // var header=new HttpHeaders().set("content-type","application/jason")
   //   console.log(json)
   //   console.log(json)
   // } 
}

isPNG(file: any): boolean {
  debugger
  return file.type === 'image/png';
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
onSelect(id:number):void{

  this.sharedService.getTipoAnimalPorTipoRaza(id).then(data => {
   this.arrRazas=data.data
  })
}
private sex: number;
public setSexo(sexo): void {
  this.mascota.idSexo = sexo;
  this.sex = sexo;
}

base64FromChild: string | undefined;

public onBase64Ready(base64: string) {
  this.base64FromChild = base64.replace("data:image/png;base64,", "");
}

public formatError(): void {
  this.callToast("El formato de la imagen debe ser PNG.", 3000, "errorToast");
}

}
