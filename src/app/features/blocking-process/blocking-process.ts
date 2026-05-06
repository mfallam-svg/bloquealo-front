import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// 1. IMPORTAMOS EL SERVICIO Y LOS CONTRATOS
import { ApiService } from '../../core/services/api.service';
import { SolicitudBloqueoPayload, TicketRespuesta } from '../../core/models/bloqueo.models';

@Component({
  selector: 'app-blocking-process',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blocking-process.html',
  styleUrl: './blocking-process.scss'
})
export class BlockingProcessComponent implements OnInit {
  estadoActual: 'procesando' | 'completado' = 'procesando';
  progreso: number = 0;
  
  estadoBloqueo: 'pendiente' | 'procesando' | 'completado' = 'procesando';
  estadoReporte: 'pendiente' | 'procesando' | 'completado' = 'pendiente';

  cantidadAcciones: number = 2;
  hizoBloqueo: boolean = true;
  hizoReporte: boolean = true;
  
  // Estas variables se llenarán con lo que responda el Backend
  codigoSolicitud: string = '';
  fechaSolicitud: string = '';
  
  // Aquí guardamos el Payload que nos envía la pantalla anterior
  payloadRecibido!: SolicitudBloqueoPayload;

  constructor(
    private router: Router, 
    private cdr: ChangeDetectorRef,
    private apiService: ApiService // 2. INYECTAMOS EL SERVICIO
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['payload']) {
      // Atrapamos el Payload
      this.payloadRecibido = navigation.extras.state['payload'];
      this.cantidadAcciones = navigation.extras.state['cantidad'] || 2;
      
      // Ajustamos los checks según lo que haya marcado el usuario
      this.hizoBloqueo = this.payloadRecibido.acciones.bloqueoLinea;
      this.hizoReporte = this.payloadRecibido.acciones.reportePolicia;
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    this.iniciarAnimacionVisual();
    this.procesarEnBackend();
  }

  iniciarAnimacionVisual() {
    const intervalo = setInterval(() => {
      this.progreso += 2; 
      
      if (this.progreso === 50) {
        this.estadoBloqueo = 'completado';
        this.estadoReporte = 'procesando';
      }
      this.cdr.detectChanges(); 

      if (this.progreso >= 100) {
        this.progreso = 100;
        this.estadoReporte = 'completado';
        clearInterval(intervalo);
        this.cdr.detectChanges(); 
        
        setTimeout(() => {
          this.estadoActual = 'completado';
          this.cdr.detectChanges(); 
        }, 500);
      }
    }, 60); 
  }

  // 3. LA LLAMADA OFICIAL AL BACKEND
  procesarEnBackend() {
    if (this.payloadRecibido) {
      this.apiService.procesarSolicitudBloqueo(this.payloadRecibido).subscribe({
        next: (respuesta: TicketRespuesta) => {
          // Cuando el servidor responde con éxito, sacamos SU código y SU fecha
          this.codigoSolicitud = respuesta.codigoSolicitud;
          this.formatearFechaBackend(respuesta.fechaProcesamiento);
        },
        error: (err) => {
          console.error('Error al procesar el bloqueo:', err);
        }
      });
    }
  }

  formatearFechaBackend(fechaISO: string) {
    // Transformamos la fecha que manda el servidor al formato que te gustó:
    // "06 de mayo del 2026 - 05:46 p. m."
    const fecha = new Date(fechaISO);
    
    const dia = fecha.getDate().toString().padStart(2, '0');
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();

    let horas = fecha.getHours();
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const ampm = horas >= 12 ? 'p. m.' : 'a. m.';
    horas = horas % 12;
    horas = horas ? horas : 12; 
    const horasStr = horas.toString().padStart(2, '0');

    this.fechaSolicitud = `${dia} de ${mes} del ${anio} - ${horasStr}:${minutos} ${ampm}`;
  }

  volverAlPanel() {
    this.router.navigate(['/dashboard']);
  }
}