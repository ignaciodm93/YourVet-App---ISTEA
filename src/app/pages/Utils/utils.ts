export function formatearFecha(fecha: string): string {
    const fechaObjeto = new Date(fecha);

    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const dia = fechaObjeto.getDate()+1;
    const mes = meses[fechaObjeto.getMonth()];
    const fechaFormateada = `${dia} de ${mes}`;
    
    return fechaFormateada;
}

export function isNotNullAndNotUndefined(campo): boolean {
  return campo != undefined && campo != null && campo.length >= 1;
}

export function convertirAParametros(objeto: { [key: string]: any }): string {
    const parametros = [];
    for (const clave in objeto) {
        if (objeto.hasOwnProperty(clave)) {
            parametros.push(`${clave}=${objeto[clave]}`);
        }
    }
    return parametros.join('&');
}



// }