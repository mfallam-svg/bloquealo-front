import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, map, throwError } from 'rxjs';
import { 
  ValidacionReniecPayload, 
  UsuarioReniec, 
  LineaMovil, 
  SolicitudBloqueoPayload, 
  TicketRespuesta,
  Departamento 
} from '../models/bloqueo.models';

@Injectable({
  providedIn: 'root' 
})
export class ApiService {
  
  private readonly API_URL = 'https://bloquealo-backend.onrender.com';

  constructor(private http: HttpClient) { }

  
  obtenerUbigeo(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${this.API_URL}/ubigeo`);
  }
   
  obtenerLineasUsuario(dni: string): Observable<LineaMovil[]> {
    console.log('Solicitando líneas para el DNI:', dni);
    
    return this.http.get<LineaMovil[]>(`${this.API_URL}/lineas`).pipe(
      map(todasLasLineas => {
       
        const lineasFiltradas = todasLasLineas.filter(l => l.dni === dni);
        console.log('Líneas encontradas:', lineasFiltradas);
        return lineasFiltradas;
      })
    );
  }

  
  procesarSolicitudBloqueo(payload: SolicitudBloqueoPayload): Observable<TicketRespuesta> {
    return this.http.post<any>(`${this.API_URL}/solicitudes-bloqueo`, payload).pipe(
      map(res => {
        
        const randomNum = Math.floor(1000 + Math.random() * 9999);
        return {
          exito: true,
          codigoSolicitud: `SIBP-2026-${randomNum}`,
          fechaProcesamiento: new Date().toISOString(),
          mensaje: 'Medidas de seguridad ejecutadas y guardadas en el servidor.'
        };
      })
    );
  }

  
  validarReniec(payload: ValidacionReniecPayload): Observable<UsuarioReniec> {
    console.log('Buscando DNI en la base de datos simulada:', payload.dni);
    
    return this.http.get<UsuarioReniec[]>(`${this.API_URL}/validaciones-reniec`).pipe(
      map(usuarios => {
        
        
        const usuarioEncontrado = usuarios.find(u => u.dni === payload.dni);
        
        if (usuarioEncontrado) {
          console.log('¡Usuario encontrado!', usuarioEncontrado);
          return usuarioEncontrado; 
        } else {
          throw new Error('El DNI ingresado no se encuentra registrado en el padrón de RENIEC.');
        }
      })
    );
  }
}