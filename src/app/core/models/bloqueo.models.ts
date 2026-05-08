// RENIEC

export interface ValidacionReniecPayload {
  dni: string;
  biometriaExitosa: boolean;
}

export interface UsuarioReniec {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  dni: string;
  autenticado: boolean;
}


// LÍNEAS MÓVILES

export interface LineaMovil {
  id: number;
  dni: string;
  numero: string;
  operador: string;
  estado: string;
}


// SOLICITUD FINAL

export interface DatosIncidente {
  modalidad: string;
  departamento: string;
  provincia: string;
  distrito: string;
  calle: string;
  referencia: string;
  fecha: string;
  hora: string;
  
}

export interface SolicitudBloqueoPayload {
  usuarioDni: string;          
  lineasIds: number[];         
  correoNotificacion: string;  
  acciones: {
    bloqueoLinea: boolean;     
    reportePolicia: boolean;   
  };
  datosIncidente: DatosIncidente | null; 
}

// Ggenerar el Ticket
export interface TicketRespuesta {
  exito: boolean;
  codigoSolicitud: string;
  fechaProcesamiento: string;
  mensaje: string;
}


export interface Provincia {
  nombre: string;
  distritos: string[];
}

export interface Departamento {
  nombre: string;
  provincias: Provincia[];
}