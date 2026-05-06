// ==========================================
// 1. CONTRATOS DE AUTENTICACIÓN (RENIEC)
// ==========================================
export interface ValidacionReniecPayload {
  dni: string;
  biometriaExitosa: boolean; // El resultado del facevalidar
}

export interface UsuarioReniec {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  dni: string;
  autenticado: boolean;
}

// ==========================================
// 2. CONTRATOS DE LÍNEAS MÓVILES
// ==========================================
export interface LineaMovil {
  id: number;
  numero: string;
  operador: string;
  estado: string;
}

// ==========================================
// 3. CONTRATOS DE LA SOLICITUD FINAL
// ==========================================

// Los datos del robo/pérdida
export interface DatosIncidente {
  modalidad: string;
  departamento: string;
  provincia: string;
  distrito: string;
  calle: string;
  referencia: string;
  fecha: string;
  hora: string;
  correoNotificacion: string;
}

// EL PAQUETE COMPLETO QUE VIAJA AL BACKEND
export interface SolicitudBloqueoPayload {
  usuarioDni: string;          // Saber de quién es el trámite
  lineasIds: number[];         // Solo enviamos los IDs de las líneas que seleccionó
  acciones: {
    bloqueoLinea: boolean;     // ¿Marcó el check de bloquear línea?
    reportePolicia: boolean;   // ¿Marcó el check de reporte policial?
  };
  // Si no hizo reporte policial, esto viaja como "null"
  datosIncidente: DatosIncidente | null; 
}

// La respuesta oficial del servidor para generar el Ticket
export interface TicketRespuesta {
  exito: boolean;
  codigoSolicitud: string;
  fechaProcesamiento: string;
  mensaje: string;
}