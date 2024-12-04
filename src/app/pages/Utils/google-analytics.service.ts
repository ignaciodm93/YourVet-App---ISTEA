import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { delay } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {

  constructor(private authService: AuthService, private route: Router) {}

  enviarEventoPersonalizado(evento: string, datos: any = null): void {
    window["dataLayer"] = window["dataLayer"] || [];
    window["dataLayer"].push({
      'event': evento,
      'datosPersonalizados': datos,
    });
  }

  click(nombre: string): void {
    window["dataLayer"] = window["dataLayer"] || [];
    window["dataLayer"].push({
      'event': "click",
      'clickplace': nombre,
      'userId': this.authService.getUsuarioCredenciales().id,
      'userName': this.authService.getUsuarioCredenciales().nombreUsuario,
      'tipoCliente': (this.authService.getUsuarioCredenciales().esCliente == true ? "C": "V"),
      'paginaActual': this.route.url
    });
  }

  public cambioDeRuta(ruta): void {
    window["dataLayer"] = window["dataLayer"] || [];
    window["dataLayer"].push({
      'event': "redireccion",
      'ruta': ruta,
      'userId': this.authService.getUsuarioCredenciales().id,
      'userName': this.authService.getUsuarioCredenciales().nombreUsuario,
    });
  }


  //*******************************MOCKEO GOOGLE ANALYTICS**************************************/

  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async repeatGaMock() {
    const repetitions = 5;
    const spacing = 5000;
  
    // for (let i = 0; i < repetitions; i++) {
    //   await this.gaMock();
    //   if (i < repetitions - 1) {
    //     await delay(spacing); 
    //   }
    // }

    for (let index = 0; index < 1; index++) {
      setTimeout(() => {
        this.gaMock();
      }, 50000);  
    }
  }

  async gaMock() {
    this.mockArray3.forEach(e => {
      this.individualMock(e);
    });
  }

  individualMock(mock) {
    window["dataLayer"] = window["dataLayer"] || [];
    window["dataLayer"].push({
      'event': "click",
      'clickplace': mock.click,
      'userId': mock.id,
      'userName': mock.userName,
      'tipoCliente': mock.tipoCliente,
      'paginaActual': mock.paginaActual
    });
    console.log(mock.userName);
  }

  async iterarConRetraso() {
    // for (const elemento of this.m4) {
    //   this.individualMock(elemento);
    //   await this.sleep(5000); // Espera 20 segundos
    // }
    while (true) {
      const objetoAleatorio = this.obtenerObjetoAleatorio();
      this.individualMock(objetoAleatorio);
      await this.sleep(2000); // Espera 5 segundos
    }
  }

  private obtenerObjetoAleatorio(): any {
    const indiceAleatorio = Math.floor(Math.random() * this.m5.length);
    return this.m5[indiceAleatorio];
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  mockArray =  
  [new MockModel(10, "Pablo_12", "Creación de turno", "C", "/client/shiftsc"), 
    new MockModel(10, "Pablo_12", "Dropdown de mes", "C", "/client/shiftsc"), 
    new MockModel(11, "Mar_Baez", "Nueva mascota", "C", "/client/pets"), 
    new MockModel(11, "Mar_Baez", "Registro de mascota", "C", "/client/new-pet"), 
    new MockModel(12, "Andrés_Cli", "Dropdown de día", "C", "/client/shiftsc"),
    new MockModel(12, "Andrés_Cli", "Dropdown de año", "C", "/client/shiftsc"), 
    new MockModel(13, "Pergo_88", "Nueva mascota", "C", "/client/shiftsc"), 
    new MockModel(13, "Pergo_88", "Dropdown de mes", "C", "/client/shiftsc"), 
    new MockModel(13, "Pergo_88", "Descarga de historial clínico", "C", "/client/setting"),
    new MockModel(14, "ElRefugio_Vet", "Creación de historial clínico", "V", "/client/shifts"),
    new MockModel(15, "Cuchitas_Vet", "Descarga de historial clínico", "V", "/client/shifts"),
    new MockModel(14, "ElRefugio_Vet", "Búsqueda de mascota", "V", "/client/shifts"),
    new MockModel(13, "Pergo_88", "Nuevo turno", "C", "/client/shiftsc"), 
    new MockModel(13, "Pergo_88", "Dropdown de mes", "C", "/client/shiftsc"), 
    new MockModel(13, "Pergo_88", "Descarga de historial clínico", "C", "/client/setting"),
    new MockModel(14, "ElRefugio_Vet", "Creación de historial clínico", "V", "/client/shifts"),
    new MockModel(15, "Cuchitas_Vet", "Nuevo turno", "V", "/client/shifts"),
    new MockModel(14, "ElRefugio_Vet", "Dashboard", "V", "/client/shifts"),
    new MockModel(14, "ElRefugio_Vet", "Carga de foto", "V", "/client/shifts"),
    new MockModel(16, "Jaz33", "Nueva mascota", "C", "/client/new-pet")
  ];

  mockArray2 = [new MockModel(20, "Juan17", "Creación de turno", "C", "/client/shiftsc"),
  new MockModel(21, "Maria23", "Dropdown de mes", "C", "/client/shiftsc"),
  new MockModel(22, "Pedro45", "Nueva mascota", "C", "/client/pets"),
  new MockModel(23, "Luisa12", "Registro de mascota", "C", "/client/new-pet"),
  new MockModel(24, "Ana34", "Dropdown de día", "C", "/client/shiftsc"),
  new MockModel(25, "Carlos56", "Dropdown de año", "C", "/client/shiftsc"),
  new MockModel(26, "Laura78", "Nueva mascota", "C", "/client/shiftsc"),
  new MockModel(27, "Santiago90", "Dropdown de mes", "C", "/client/shiftsc"),
  new MockModel(28, "Valeria11", "Descarga de historial clínico", "C", "/client/setting"),
  new MockModel(29, "Roberto67", "Creación de historial clínico", "V", "/client/shifts"),
  new MockModel(30, "Isabel89", "Descarga de historial clínico", "V", "/client/shifts"),
  new MockModel(31, "Eduardo21", "Búsqueda de mascota", "V", "/client/shifts"),
  new MockModel(32, "Camila43", "Nuevo turno", "C", "/client/shiftsc"),
  new MockModel(33, "Javier65", "Dropdown de mes", "C", "/client/shiftsc"),
  new MockModel(34, "Silvia87", "Descarga de historial clínico", "C", "/client/setting"),
  new MockModel(35, "Guillermo32", "Creación de historial clínico", "V", "/client/shifts"),
  new MockModel(36, "Adriana54", "Nuevo turno", "V", "/client/shifts"),
  new MockModel(37, "Mariano76", "Dashboard", "V", "/client/shifts"),
  new MockModel(38, "Carolina98", "Carga de foto", "V", "/client/shifts"),
  new MockModel(39, "Elena10", "Nueva mascota", "C", "/client/new-pet")
];

mockArray3 =  
  [new MockModel(10, "Pablo_12", "Creación de turno", "C", "/client/shiftsc"), 
    new MockModel(10, "Pablo_12", "Dropdown de mes", "C", "/client/shiftsc"), 
    new MockModel(11, "Mar_Baez", "Nueva mascota", "C", "/client/pets"), 
    new MockModel(11, "Mar_Baez", "Registro de mascota", "C", "/client/new-pet"), 
    new MockModel(12, "Andrés_Cli", "Dropdown de día", "C", "/client/shiftsc"), 
  new MockModel(13, "Pergo_88", "Descarga de historial clínico", "C", "/client/setting"),
  new MockModel(14, "ElRefugio_Vet", "Creación de historial clínico", "V", "/client/shifts"),
  new MockModel(15, "Cuchitas_Vet", "Descarga de historial clínico", "V", "/client/shifts"),
  new MockModel(14, "ElRefugio_Vet", "Búsqueda de mascota", "V", "/client/shifts"),
  new MockModel(13, "Pergo_88", "Nuevo turno", "C", "/client/shiftsc"), 
  new MockModel(32, "Camila43", "Nuevo turno", "C", "/client/shiftsc"),
  ];

//**********************************************************************************/
m5 = [

  new MockModel(10, "Pablo_12", "Creación de turno", "C", "/client/shiftsc"), 
  new MockModel(10, "Pablo_12", "Dropdown de mes", "C", "/client/shiftsc"), 
  new MockModel(11, "Mar_Baez", "Nueva mascota", "C", "/client/pets"), 
  new MockModel(11, "Mar_Baez", "Registro de mascota", "C", "/client/new-pet"), 
  new MockModel(12, "Andrés_Cli", "Dropdown de día", "C", "/client/shiftsc"), 
new MockModel(13, "Pergo_88", "Descarga de historial clínico", "C", "/client/setting"),
new MockModel(14, "ElRefugio_Vet", "Creación de historial clínico", "V", "/client/shifts"),
new MockModel(15, "Cuchitas_Vet", "Descarga de historial clínico", "V", "/client/shifts"),
new MockModel(14, "ElRefugio_Vet", "Búsqueda de mascota", "V", "/client/shifts"),
new MockModel(13, "Pergo_88", "Nuevo turno", "C", "/client/shiftsc"), 
new MockModel(32, "Camila43", "Nuevo turno", "C", "/client/shiftsc"),
new MockModel(20, "Juan17", "Creación de turno", "C", "/client/shiftsc"),
  new MockModel(21, "Maria23", "Dropdown de mes", "C", "/client/shiftsc"),
  new MockModel(22, "Pedro45", "Nueva mascota", "C", "/client/pets"),
  new MockModel(23, "Luisa12", "Registro de mascota", "C", "/client/new-pet"),
  new MockModel(24, "Ana34", "Dropdown de día", "C", "/client/shiftsc"),
  new MockModel(25, "Carlos56", "Dropdown de año", "C", "/client/shiftsc"),
  new MockModel(26, "Laura78", "Nueva mascota", "C", "/client/shiftsc"),
  new MockModel(27, "Santiago90", "Dropdown de mes", "C", "/client/shiftsc"),
  new MockModel(28, "Valeria11", "Descarga de historial clínico", "C", "/client/setting"),
  new MockModel(29, "Roberto67", "Creación de historial clínico", "V", "/client/shifts"),
  new MockModel(30, "Isabel89", "Descarga de historial clínico", "V", "/client/shifts"),
  new MockModel(31, "Eduardo21", "Búsqueda de mascota", "V", "/client/shifts"),
  new MockModel(32, "Camila43", "Nuevo turno", "C", "/client/shiftsc"),
  new MockModel(33, "Javier65", "Dropdown de mes", "C", "/client/shiftsc"),
  new MockModel(34, "Silvia87", "Descarga de historial clínico", "C", "/client/setting"),
  new MockModel(35, "Guillermo32", "Creación de historial clínico", "V", "/client/shifts"),
  new MockModel(36, "Adriana54", "Nuevo turno", "V", "/client/shifts"),
  new MockModel(37, "Mariano76", "Dashboard", "V", "/client/shifts"),
  new MockModel(38, "Carolina98", "Carga de foto", "V", "/client/shifts"),
  new MockModel(39, "Elena10", "Nueva mascota", "C", "/client/new-pet"),
  new MockModel(10, "Pablo_12", "Creación de turno", "C", "/client/shiftsc"), 
    new MockModel(10, "Pablo_12", "Dropdown de mes", "C", "/client/shiftsc"), 
    new MockModel(11, "Mar_Baez", "Nueva mascota", "C", "/client/pets"), 
    new MockModel(11, "Mar_Baez", "Registro de mascota", "C", "/client/new-pet"), 
    new MockModel(12, "Andrés_Cli", "Dropdown de día", "C", "/client/shiftsc"),
    new MockModel(12, "Andrés_Cli", "Dropdown de año", "C", "/client/shiftsc"), 
    new MockModel(13, "Pergo_88", "Nueva mascota", "C", "/client/shiftsc"), 
    new MockModel(13, "Pergo_88", "Dropdown de mes", "C", "/client/shiftsc"), 
    new MockModel(13, "Pergo_88", "Descarga de historial clínico", "C", "/client/setting"),
    new MockModel(14, "ElRefugio_Vet", "Creación de historial clínico", "V", "/client/shifts"),
    new MockModel(15, "Cuchitas_Vet", "Descarga de historial clínico", "V", "/client/shifts"),
    new MockModel(14, "ElRefugio_Vet", "Búsqueda de mascota", "V", "/client/shifts"),
    new MockModel(13, "Pergo_88", "Nuevo turno", "C", "/client/shiftsc"), 
    new MockModel(13, "Pergo_88", "Dropdown de mes", "C", "/client/shiftsc"), 
    new MockModel(13, "Pergo_88", "Descarga de historial clínico", "C", "/client/setting"),
    new MockModel(14, "ElRefugio_Vet", "Creación de historial clínico", "V", "/client/shifts"),
    new MockModel(15, "Cuchitas_Vet", "Nuevo turno", "V", "/client/shifts"),
    new MockModel(14, "ElRefugio_Vet", "Dashboard", "V", "/client/shifts"),
    new MockModel(14, "ElRefugio_Vet", "Carga de foto", "V", "/client/shifts"),
    new MockModel(16, "Jaz33", "Nueva mascota", "C", "/client/new-pet")
]


}


export class MockModel {
  userName;
  id;
  click;
  tipoCliente;
  paginaActual;

  constructor(id, name, click, tc, pa) {
    this.id = id;
    this.userName = name;
    this.click = click;
    this.tipoCliente = tc;
    this.paginaActual = pa;
  }
}

/**
 * -------------------------------------------------------
 * -------------------ISTEA YOUR VET----------------------
 * 
 * Último commit del trabajo final de Istea para recibirme,
 * aprobado con 10 el 22 de Diciembre de 2023 y
 * realizado con Luqui Martinez, Mati Meier, Nico Cabral, 
 * Pablo Cerdeira, José Pavón y Carlos Salas. 
 * 
 * Con mucho esfuerzo y cariño se deja subida la última
 * versión de master al día con los cambios presentados en
 * el final con Victor Cordero.
 * 
 * Habiendo rendido el primer parcial el día 16/12/2020
 * y siendo la última clase el día de la fecha, 22/12/2023.
 * 
 * -------------------------------------------------------
 * -------------------------------------------------------
 */