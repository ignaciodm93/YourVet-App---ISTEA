import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { isNotNullAndNotUndefined } from 'src/app/pages/Utils/utils';
import { AuthService } from 'src/app/services/auth.service';
import { ClientService } from 'src/app/services/client.service';
import { SharedServices } from 'src/app/services/sharedServices.shared';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { LoadingService } from 'src/app/shared/loading/loading.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  Modelo={
    idTipoLocalidad:"",
    NumeroDocumento: "",
    IdTipoDocumento: "",
    Calle:"",
    Numero: "",
    Piso: "",
    Departamento: "",
    CodigoPostal: "",
    DireccionCompleta: "",
    fotoPaciente: ""
  }


  data:any
  usuario:any
  imagenperfil:string
  name:string;
  nameUser:string;
  telefono:string;
  direccion:string;
  calle:string;
  numero:string;
  numerodocumento:string;
  provincia:string;
  localidad:string;
  email:string;
  codigopostal:string;
  departamento:string;
  piso:string;


  mainperfil=true
  editperfilall=false
  editsegurityall=false
  arrtLocalidad :any[]=[]
  arrtDocumento:any[]=[]


  constructor(
    private loadingService: LoadingService,
    private route:ActivatedRoute,
    private authService:AuthService,
    private suppliersService: SuppliersService,
    private sharedService: SharedServices,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    private router:  Router,
  ) { }

  ngOnInit(): void {

    let _arrtLocalidad :any[]=[]
    let _arrtDocumento:any[]=[]
 
     this.sharedService.getLocalidades().then(data =>{
       this.arrtLocalidad=data.data;
       _arrtLocalidad=data.data;
     
     })
     this.sharedService.getDocumentos().then(data =>{
       this.arrtDocumento=data.data;
       _arrtDocumento=data.data;
 
     })
 
 
     this.data=this.authService.getUsuarioCredenciales()

     this.clientService.obtenerUsuarioClientePorId(this.data.id).then(data => {
       this.usuario = data.data;
       console.log(this.usuario)
       this.calle=this.usuario.calle
       this.numero=this.usuario.numero
       this.numerodocumento=this.usuario.numeroDocumento
       this.direccion=this.usuario.direccion
       this.departamento=this.usuario.departamento
       this.piso=this.usuario.piso
       this.codigopostal=this.usuario.codigoPostal
       this.localidad=this.usuario.tipoLocalidadDescripcion
       this.provincia=this.usuario.tipoProvinciaDescripcion
       
 
       for(let i=0;i<_arrtLocalidad.length;i++){
        
 
         if(_arrtLocalidad[i].descripcion===this.usuario.tipoLocalidadDescripcion){
           this.Modelo.idTipoLocalidad=_arrtLocalidad[i].id
         }
  
       }
       for(let i=0;i<_arrtDocumento.length;i++){
         if(_arrtDocumento[i].descripcion===this.usuario.tipoDocumentoDescripcion){
           this.Modelo.IdTipoDocumento=_arrtDocumento[i].id
         }
       }
       this.Modelo.NumeroDocumento=this.usuario.numeroDocumento
       this.Modelo.Calle=this.usuario.calle
       this.Modelo.Numero=this.usuario.numero
       this.Modelo.Piso=this.usuario.piso
       this.Modelo.Departamento=this.usuario.departamento
       this.Modelo.CodigoPostal=this.usuario.codigoPostal
       this.Modelo.fotoPaciente=this.usuario.fotoPerfilBase64
     });
 
    

  }
  
    onSelect(id:number):void{
  
  
    }
    cancelPets():void{
      this.router.navigate(['client/user']);
  
  
    }
  
  
    ComplementarInfo():void{
  
      let cliente={
        'id':this.authService.getUsuarioCredenciales().id,//
        'idTipoLocalidad':parseInt(this.Modelo.idTipoLocalidad ,10),//
        'numeroDocumento':this.Modelo.NumeroDocumento,
        "idTipoDocumento": parseInt(this.Modelo.IdTipoDocumento ,10),
        'calle':this.Modelo.Calle,
        'numero':this.Modelo.Numero,
        'piso':this.Modelo.Piso,
        'departamento':this.Modelo.Departamento,
        'codigoPostal': this.Modelo.CodigoPostal,
        'direccionCompleta': true,
        'fotoPaciente':this.base64FromChild
      
      }

    this.clientService.actualizarUsuarioCliente(cliente).then(res =>{
      this.router.navigate(['client/user']);
      this.callToast("Se Actualizo a " + this.authService.getUsuarioCredenciales().nombreUsuario + " exitosamente.", 3000, 'okToast');
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
  
  
  base64FromChild: string | undefined;
  
  public onBase64Ready(base64: string) {
    this.base64FromChild = base64.replace("data:image/png;base64,", "");
  }
  
  public formatError(): void {
    this.callToast("El formato de la imagen debe ser PNG.", 3000, "errorToast");
  }
  
  isPNG(file: any): boolean {
    debugger
    return file.type === 'image/png';
  }
  

}
