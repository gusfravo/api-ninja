import * as xlsx from 'xlsx';

/*
 * Metodo para obtener los datos de un excel en un array
 * */
export const getDataFromExcelBuffer = <T>(
  bufferExcel: Buffer<ArrayBufferLike>,
  sheetName: string,
): T[] => {
  const workbook = xlsx.read(bufferExcel, { type: 'buffer' });
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  console.log(data);
  //console.log(first_sheet);
  //console.log(data);
  //Elminamos las cabeceras
  data.shift();
  data.shift();
  return data as T[];
};

/*
 *funcion para obtener las hojas que tiene el excel
 * */

export const getSheetNameFromExcelBuffet = (
  bufferExcel: Buffer<ArrayBufferLike>,
): string[] => {
  const workbook = xlsx.read(bufferExcel, { type: 'buffer' });
  return workbook.SheetNames;
};
