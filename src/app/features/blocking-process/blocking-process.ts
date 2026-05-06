import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  
  codigoSolicitud: string = '';
  fechaSolicitud: string = '';
  
  // NUEVO: Variable para guardar los datos del reporte policial
  datosIncidente: any = null;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.hizoBloqueo = navigation.extras.state['bloqueo'];
      this.hizoReporte = navigation.extras.state['reporte'];
      this.cantidadAcciones = navigation.extras.state['cantidad'] || 2;
      // Atrapamos la fecha y hora que vienen del formulario
      this.datosIncidente = navigation.extras.state['incidente'] || null;
    }
  }

  ngOnInit() {
    this.iniciarProceso();
    this.generarDatosTicket();
  }

  iniciarProceso() {
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

  // FUNCIÓN PARA FORMATEAR COMO "06 de mayo del 2026 · 09:39 a. m."
  formatearFechaHora(fechaStr: string, horaStr: string): string {
    if (!fechaStr || !horaStr) return '';
    
    // 1. Formateamos la fecha a mano para evitar el error de los puntos
    const [anio, mes, dia] = fechaStr.split('-');
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const nombreMes = meses[parseInt(mes, 10) - 1]; // Convierte '05' en 'mayo'
    const fechaFormateada = `${dia.padStart(2, '0')} de ${nombreMes} del ${anio}`;

    // 2. Formateamos la hora a formato 12h (a. m. / p. m.)
    const [h, m] = horaStr.split(':');
    let horas = parseInt(h, 10);
    const ampm = horas >= 12 ? 'p. m.' : 'a. m.';
    horas = horas % 12;
    horas = horas ? horas : 12; // la hora '0' pasa a ser '12'
    const horasStr = horas.toString().padStart(2, '0');
    const horaFormateada = `${horasStr}:${m} ${ampm}`;

    return `${fechaFormateada} · ${horaFormateada}`;
  }

  generarDatosTicket() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.codigoSolicitud = `SIBP-2026-${randomNum}`;

    // Usamos la fecha del incidente si existe, si no, usamos la fecha actual (ej. si solo bloqueó la línea)
    if (this.datosIncidente && this.datosIncidente.fecha && this.datosIncidente.hora) {
      this.fechaSolicitud = this.formatearFechaHora(this.datosIncidente.fecha, this.datosIncidente.hora);
    } else {
      const hoy = new Date();
      const anio = hoy.getFullYear().toString();
      const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
      const dia = hoy.getDate().toString().padStart(2, '0');
      const h = hoy.getHours().toString().padStart(2, '0');
      const m = hoy.getMinutes().toString().padStart(2, '0');
      
      this.fechaSolicitud = this.formatearFechaHora(`${anio}-${mes}-${dia}`, `${h}:${m}`);
    }
  }

  volverAlPanel() {
    this.router.navigate(['/dashboard']);
  }
}