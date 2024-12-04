import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
// import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import { AuthService } from '../../services/auth.service';
import { UsuarioRegistro } from 'src/app/models/usuarioRegistro.model';
import { ValuesService } from '../../services/values.service';
import { PreguntasSeguridad } from 'src/app/models/preguntasSeguridad';
import { TipoCodArea } from 'src/app/models/tipoCodArea';
import { LoadingService } from 'src/app/shared/loading/loading.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit,OnDestroy {
  registerForm: FormGroup;
  preguntasSeguridad: PreguntasSeguridad[] = [];
  codigosArea: TipoCodArea[] = [];

  opcionSeleccionadaTipoCliente: boolean=true;
  public durationInSeconds: number = 5;
  
  opciones = [
    { valor: true, etiqueta: 'Cliente' },
    { valor: false, etiqueta: 'Veterinaria' },
  ];

  constructor(private formBuilder: FormBuilder,
              private readonly authService:AuthService,
              private readonly valuesService:ValuesService,
              private readonly loadingService: LoadingService,
              private readonly router:Router,
              private snackBar: MatSnackBar) {}

  

  async ngOnInit(){
    this.registerForm = this.formBuilder.group({
      nombreUsuario: ['', Validators.required],
      codArea: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^[1-9]\d{6,10}$/)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(12)]],
      verificacionClave:['',[Validators.required]],
      pregunta: ['', Validators.required],
      respuesta: ['', Validators.required]
    });

    this.preguntasSeguridad = await this.valuesService.getPreguntas()
    this.codigosArea=await this.valuesService.getCodigosArea()
  }

  ngOnDestroy(): void {
    this.loadingService.hide()
  }
  
  async onSubmitRegister() {
    this.loadingService.show();
    console.log(this.registerForm)
    if (this.registerForm.valid) {
      // Aquí puedes manejar la lógica de envío del formulario
      console.log('Formulario válido y enviado con éxito');
      const credencialesRegistro:UsuarioRegistro={
        clave:this.registerForm.get('clave').value,
        email:this.registerForm.get('email').value,
        nombreCompleto:this.registerForm.get('nombre').value+ " " +this.registerForm.get('apellido').value,
        nombreUsuario:this.registerForm.get('nombreUsuario').value,
        idTipoPreguntaSeguridad:this.registerForm.get('pregunta').value,
        respuesta:this.registerForm.get('respuesta').value,
        telefono:this.registerForm.get('telefono').value,
        confirmarClave:this.registerForm.get('clave').value,
        esAdmin:false,
        tokenCaptcha:'',
        esCliente:this.opcionSeleccionadaTipoCliente
      }
      setTimeout(() => {
        this.loadingService.hide();
      }, 2000);
      if(await this.authService.register(credencialesRegistro)){
        this.callToast("Registro exitoso, por favor confirme desde su correo.", 5000, "okToast");
        this.router.navigate(['/login'])
      } else {
        this.callToast("Ocurrió un error al intentar registrarse.", 3000, "errorToast");
      }
      
    } else {
      // Si el formulario no es válido, puedes mostrar mensajes de error o realizar otras acciones.
    }
  }

  getErrorMessage(field: string) {
    if (field == 'nombreUsuario' && this.registerForm.get(field).touched) {
      if (this.registerForm.get(field).hasError('required')) {
        return 'El nombre de usuario es obligatorio.';
      }
      if (this.registerForm.get(field).hasError('minlength')) {
        return 'El nombre de usuario debe tener al menos 5 caracteres.';
      }
    }
    if (field == 'telefono' && this.registerForm.get(field).touched) {
      if (this.registerForm.get(field).hasError('required')) {
        return 'El número de teléfono es obligatorio.';
      }
      if (this.registerForm.get(field).hasError('pattern')) {
        return 'Numero invalido.';
      }
    }
    if (field == 'email' && this.registerForm.get(field).touched) {
      if (this.registerForm.get(field).hasError('required')) {
        return 'El correo electrónico es obligatorio.';
      }
      if (this.registerForm.get(field).hasError('email')) {
        return 'Ingresa un correo electrónico válido.';
      }
    }
    if(field== 'clave' && this.registerForm.get(field).touched){
      if (this.registerForm.get(field).hasError('required')) {
        return 'La contraseña es obligatorio.';
      }
      if (this.registerForm.get(field).hasError('minlength') ||this.registerForm.get(field).hasError('Maxlength') ) {
        return 'La contraseña de tener entre 6 y 12 caracteres validos.';
      }
    }
    if(field== 'verificacionClave' && this.registerForm.get(field).touched){
      if (this.registerForm.get(field).value != this.registerForm.get('clave').value) {
        return 'Las contraseñas no son iguales';
      }
    }
    if (field == 'nombre' && this.registerForm.get(field).touched) {
      if (this.registerForm.get(field).hasError('required')) {
        return 'El nombre es obligatorio.';
      }
    }
    if (field == 'apellido' && this.registerForm.get(field).touched) {
      if (this.registerForm.get(field).hasError('required')) {
        return 'El apellido es obligatorio.';
      }
    }
    if (field == 'codArea' && this.registerForm.get(field).touched) {
      if (this.registerForm.get(field).hasError('required')) {
        return 'Seleccione un cod.Area';
      }
    }
    if (field == 'pregunta' && this.registerForm.get(field).touched) {
      if (this.registerForm.get(field).hasError('required')) {
        
        return 'Seleccione una pregunta';
      }
    }
    // Agrega más mensajes de error para otros campos si es necesario
    return '';
  }

  volverHome(){
    this.router.navigate(['/home'])
  }

  public setValor(tipoCliente): void {
    this.opcionSeleccionadaTipoCliente = tipoCliente;
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
