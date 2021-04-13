// tslint:disable-next-line:no-var-keyword
export var URL = {
  // url: '//localhost/SCC/WS_SCC/',
  // url: '//localhost:8181/', // Cuando el servidor se crea desde la línea de comandos
  // url: '../SCC/WS_SCC/', // Cuando se compila el proyecto de prueba
  url:'../WS_SCC/', // URL de Alvis
  // url: 'https://coopalvis.com/WS_SCC/', // Para probar los servicios del hosting de Alvis
  // url: 'http://192.168.1.200/SCC/WS_SCC/', // Cuando se utiliza la PC principal
  // url: 'https://genussolucionesti.com/SCC/WS_SCC/', // En caso no funcione localmente el PHP
                                                       // Los cambios deben hacerse directamenre en el hosting
};

export const URLIMAGENES = {
  urlimages: URL.url+'file/upload.php',
  carpeta: URL.url+'uploads/',
};

export const URLLLAMADAS = {
  carpeta: URL.url+'../ACR/',
}