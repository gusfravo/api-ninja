export const getDateFromRFC = (rfc: string) => {
  // Convierte el RFC a mayúsculas para un procesamiento consistente
  const rfcMayusculas = rfc.toUpperCase();

  // Asegúrate de que el RFC tenga al menos 6 caracteres para la fecha
  if (rfcMayusculas.length < 6) {
    throw new Error('RFC inválido: no contiene una fecha completa.');
  }

  // Extrae los primeros 6 caracteres que corresponden a la fecha
  const fechaParte = rfcMayusculas.substring(4, 10);

  // Los primeros dos dígitos son el año (ej: 73)
  let anio = parseInt(fechaParte.substring(0, 2), 10);
  // Los siguientes dos son el mes (ej: 05)
  const mes = parseInt(fechaParte.substring(2, 4), 10) - 1; // El mes en JavaScript es 0-indexado (0 = enero, 11 = diciembre)
  // Los últimos dos son el día (ej: 13)
  const dia = parseInt(fechaParte.substring(4, 6), 10);

  // A partir del año, determina el siglo. Si el año es mayor al año actual (ej: '97'), asume que es '19xx'.
  // De lo contrario, asume que es '20xx'.
  const anioActual = new Date().getFullYear() % 100;
  anio = anio >= anioActual ? 1900 + anio : 2000 + anio;

  // Crea un objeto Date
  const fechaNacimiento = new Date(anio, mes, dia);

  // Verifica si la fecha es válida. Si alguna de las partes no es un número, la fecha será "Invalid Date"
  if (!fechaNacimiento) {
    throw new Error(
      'RFC inválido: la fecha no pudo ser interpretada correctamente.',
    );
  }

  // Retorna la fecha en formato de cadena
  return fechaNacimiento;
};
