import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { 
  ValidacionReniecPayload, 
  UsuarioReniec, 
  LineaMovil, 
  SolicitudBloqueoPayload, 
  TicketRespuesta 
} from '../models/bloqueo.models';

@Injectable({
  providedIn: 'root' // Esto permite que cualquier pantalla use este servicio
})
export class ApiService {

  constructor() { }

  // =================================================================
  // 1. ENDPOINT SIMULADO: POST /api/auth/validar-reniec
  // =================================================================
  validarReniec(payload: ValidacionReniecPayload): Observable<UsuarioReniec> {
    console.log('[Backend Simulado] Consultando a la base de datos de RENIEC...', payload);

    const mockResponse: UsuarioReniec = {
      nombres: 'JUAN CARLOS', // Datos ficticios para la simulación
      apellidoPaterno: 'QUISPE',
      apellidoMaterno: 'MAMANI',
      dni: payload.dni,
      autenticado: payload.biometriaExitosa
    };

    // Usamos of() para emitir la respuesta y delay() para simular que tarda 1.5 segundos
    return of(mockResponse).pipe(delay(1500));
  }

  // =================================================================
  // 2. ENDPOINT SIMULADO: GET /api/lineas/{dni}
  // =================================================================
  obtenerLineasUsuario(dni: string): Observable<LineaMovil[]> {
    console.log(`[Backend Simulado] Buscando líneas registradas para el DNI: ${dni}`);

    const mockResponse: LineaMovil[] = [
      { id: 1, numero: '966 053 100', operador: 'Claro', estado: 'Activo' },
      { id: 2, numero: '987 456 321', operador: 'Movistar', estado: 'Activo' },
      { id: 3, numero: '901 234 567', operador: 'Entel', estado: 'Activo' }
    ];

    // Simulamos 1 segundo de latencia en la red
    return of(mockResponse).pipe(delay(1000));
  }

  // =================================================================
  // 3. ENDPOINT SIMULADO: POST /api/solicitudes/bloquear
  // =================================================================
  procesarSolicitudBloqueo(payload: SolicitudBloqueoPayload): Observable<TicketRespuesta> {
    console.log('[Backend Simulado] Recibiendo Payload final en el servidor:');
    console.dir(payload, { depth: null }); // Imprime el JSON bonito en la consola

    // Generamos el ticket dinámico
    const randomNum = Math.floor(1000 + Math.random() * 9000);

    const mockResponse: TicketRespuesta = {
      exito: true,
      codigoSolicitud: `SIBP-2026-${randomNum}`,
      fechaProcesamiento: new Date().toISOString(), // Hora exacta del servidor
      mensaje: 'Medidas de seguridad ejecutadas correctamente en la red nacional.'
    };

    // Simulamos 2.5 segundos (tiempo que tardaría en hablar con bancos y operadoras)
    return of(mockResponse).pipe(delay(2500));
  }
}