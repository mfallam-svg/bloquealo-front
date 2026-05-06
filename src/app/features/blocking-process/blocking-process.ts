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

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.hizoBloqueo = navigation.extras.state['bloqueo'];
      this.hizoReporte = navigation.extras.state['reporte'];
      this.cantidadAcciones = navigation.extras.state['cantidad'] || 2;
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

  // --- LÓGICA ACTUALIZADA PARA LA FECHA ACTUAL ---
  generarDatosTicket() {
    // 1. Generamos el código de ticket
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.codigoSolicitud = `SIBP-2026-${randomNum}`;

    // 2. Obtenemos la fecha y hora EXACTA de este momento
    const ahora = new Date();
    
    // Formateo de fecha: "06 de mayo del 2026"
    const dia = ahora.getDate().toString().padStart(2, '0');
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const mes = meses[ahora.getMonth()];
    const anio = ahora.getFullYear();

    // Formateo de hora: "12:24 p. m."
    let horas = ahora.getHours();
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const ampm = horas >= 12 ? 'p. m.' : 'a. m.';
    horas = horas % 12;
    horas = horas ? horas : 12; // el '0' lo pasamos a '12'
    const horasStr = horas.toString().padStart(2, '0');

    // 3. Unimos todo con el GUION solicitado
    this.fechaSolicitud = `${dia} de ${mes} del ${anio} - ${horasStr}:${minutos} ${ampm}`;
  }

  volverAlPanel() {
    this.router.navigate(['/dashboard']);
  }
}