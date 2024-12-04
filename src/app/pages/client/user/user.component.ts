import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ClientService } from 'src/app/services/client.service';
import { SharedServices } from 'src/app/services/sharedServices.shared';
import { SuppliersService } from 'src/app/services/suppliers.service';
import { LoadingService } from 'src/app/shared/loading/loading.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
 
 
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
  ) {
    
   }

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


    this.nameUser=this.data.nombreUsuario
    this.name=this.data.nombreCompleto
    this.telefono=this.data.telefono
    this.email=this.data.email
 
   

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
      this.imagenperfil=this.usuario.fotoPerfilBase64
    });

   
    

  }

  editsegurity(): void{
    this.router.navigate(['client/update-user']);
 
  }
  
  editsperfil(): void{
  
  if(this.mainperfil){
    this.mainperfil=false
    this.editperfilall=true
  }
  else{ 
     this.mainperfil=true
     this.editperfilall=false
  }
  }


  onSelect(id:number):void{


  }
}



