import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitudBloqueoPayload } from '../../core/models/bloqueo.models';

@Component({
  selector: 'app-security-measures',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './security-measures.html',
  styleUrl: './security-measures.scss'
})
export class SecurityMeasuresComponent implements OnInit {
  lineasSeleccionadas: any[] = []; 
  mostrarLineas = false; 

  bloqueoLinea: boolean = false;
  reportePolicia: boolean = false;

  incidente = {
    modalidad: '', departamento: '', provincia: '', distrito: '',
    calle: '', referencia: '', fecha: '', hora: '', correo: ''
  };

  maxDate: string = '';
  
  departamentos = ['Amazonas', 'Arequipa', 'Cusco', 'Lima', 'Piura'];
  provincias = ['Lima', 'Callao', 'Cañete', 'Cusco'];
  distritos = ['Miraflores', 'San Isidro', 'San Borja', 'Surco', 'Cercado de Lima', 'Cusco'];

  // --- VARIABLES DEL MAPA ---
  mostrarModalMapa: boolean = false;
  buscandoUbicacion: boolean = false;

  // --- VARIABLES PARA EL RELOJ ESTÉTICO ---
  mostrarReloj: boolean = false;
  relojModo: 'horas' | 'minutos' = 'horas';
  horasReloj = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  minutosReloj = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  
  horaTemporal: string = '12';
  minutoTemporal: string = '00';

  // 1. INYECTAMOS EL ChangeDetectorRef EN EL CONSTRUCTOR
  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['lineas']) {
      this.lineasSeleccionadas = navigation.extras.state['lineas'];
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
  }

  get cantidadAcciones(): number {
    let count = 0;
    if (this.bloqueoLinea) count++;
    if (this.reportePolicia) count++;
    return count;
  }

  get mostrarAlertaBloqueo(): boolean {
    return this.reportePolicia && !this.bloqueoLinea;
  }

  get esFormularioValido(): boolean {
    if (this.cantidadAcciones === 0) return false;

    if (this.reportePolicia) {
      const formCompleto = 
        this.incidente.modalidad !== '' && this.incidente.departamento !== '' &&
        this.incidente.provincia !== '' && this.incidente.distrito !== '' &&
        this.incidente.calle.trim() !== '' && this.incidente.fecha !== '' &&
        this.incidente.hora !== '' && this.incidente.correo.includes('@'); 
      
      return formCompleto && !this.mostrarAlertaBloqueo;
    }
    return this.bloqueoLinea;
  }

  toggleLineas() { this.mostrarLineas = !this.mostrarLineas; }

  // --- FUNCIONES DEL MAPA ---
  abrirMapa(event: Event) {
    event.preventDefault(); 
    this.mostrarModalMapa = true;
    this.buscandoUbicacion = true;

    // 2. FORZAMOS EL CAMBIO DESPUÉS DE 2 SEGUNDOS EXACTOS
    setTimeout(() => {
      this.buscandoUbicacion = false;
      this.cdr.detectChanges(); // ¡Esta es la magia que despierta a Angular!
    }, 2000); 
  }

  cerrarMapa() {
    this.mostrarModalMapa = false;
  }

  confirmarUbicacion() {
    this.incidente.departamento = 'Lima';
    this.incidente.provincia = 'Lima';
    this.incidente.distrito = 'San Borja';
    this.incidente.calle = 'Av. Javier Prado Este'; 
    this.cerrarMapa();
  }

  // --- FUNCIONES DEL RELOJ ---
  abrirReloj() {
    this.mostrarReloj = true;
    this.relojModo = 'horas';
  }

  seleccionarHoraReloj(h: number) {
    this.horaTemporal = h < 10 ? `0${h}` : `${h}`;
    this.relojModo = 'minutos'; 
  }

  seleccionarMinutoReloj(m: string) {
    this.minutoTemporal = m;
    this.incidente.hora = `${this.horaTemporal}:${this.minutoTemporal}`;
    this.mostrarReloj = false; 
  }

  ejecutarAcciones() {
    if (this.esFormularioValido) {
      
      // 1. ARMAMOS EL PAQUETE (PAYLOAD) EXACTAMENTE COMO LO PIDE EL BACKEND
      const payloadAlBackend: SolicitudBloqueoPayload = {
        usuarioDni: '74125896', // DNI simulado del usuario logueado
        lineasIds: this.lineasSeleccionadas.map(linea => linea.id), // Extraemos solo los IDs [1, 2, 3...]
        
        acciones: {
          bloqueoLinea: this.bloqueoLinea,
          reportePolicia: this.reportePolicia
        },
        
        // 2. Si hay reporte policial, mapeamos los datos. Si no, enviamos 'null'
        datosIncidente: this.reportePolicia ? {
          modalidad: this.incidente.modalidad,
          departamento: this.incidente.departamento,
          provincia: this.incidente.provincia,
          distrito: this.incidente.distrito,
          calle: this.incidente.calle,
          referencia: this.incidente.referencia,
          fecha: this.incidente.fecha,
          hora: this.incidente.hora,
          correoNotificacion: this.incidente.correo
        } : null
      };

      // 3. ENVIAMOS EL PAYLOAD A LA PANTALLA DE CARGA
      this.router.navigate(['/blocking-process'], {
        state: { 
          payload: payloadAlBackend,
          cantidad: this.cantidadAcciones
        }
      });
    }
  }
}