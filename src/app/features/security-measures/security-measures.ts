import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitudBloqueoPayload, LineaMovil, Departamento, Provincia } from '../../core/models/bloqueo.models';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-security-measures',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './security-measures.html',
  styleUrl: './security-measures.scss'
})
export class SecurityMeasuresComponent implements OnInit {
  lineasSeleccionadas: LineaMovil[] = []; 
  mostrarLineas = false; 

  bloqueoLinea: boolean = true; 
  reportePolicia: boolean = false;

  incidente = {
    modalidad: '', departamento: '', provincia: '', distrito: '',
    calle: '', referencia: '', fecha: '', hora: '', correo: ''
  };

  maxDate: string = '';  
  
  departamentosPeru: Departamento[] = [];
  provinciasDisponibles: Provincia[] = [];
  distritosDisponibles: string[] = [];

  mostrarReloj: boolean = false;
  horaSel: number = 12;
  minutoSel: number = 0;
  periodoSel: 'AM' | 'PM' = 'AM';

  constructor(
    private router: Router, 
    private cdr: ChangeDetectorRef,
    private apiService: ApiService 
  ) {
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
        
    this.apiService.obtenerUbigeo().subscribe({
      next: (data) => {
        this.departamentosPeru = data;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al cargar los departamentos:', err);
      }
    });
  }

  get cantidadAcciones(): number {
    let count = 1; 
    if (this.reportePolicia) count++;
    return count;
  }

  get esFormularioValido(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const correoValido = emailRegex.test(this.incidente.correo);

    if (!correoValido) return false;

    if (this.reportePolicia) {
      const formCompleto =
        this.incidente.modalidad !== '' && 
        this.incidente.departamento !== '' &&
        this.incidente.provincia !== '' && 
        this.incidente.distrito !== '' &&
        this.incidente.calle.trim() !== '' && 
        this.incidente.fecha !== '' &&
        this.incidente.hora !== ''; 

      return formCompleto;
    }
    
    return true; 
  }

  toggleLineas() { this.mostrarLineas = !this.mostrarLineas; }

  
  onDepartamentoChange() {
    const dep = this.departamentosPeru.find(d => d.nombre === this.incidente.departamento);
    this.provinciasDisponibles = dep ? dep.provincias : [];
    
    this.distritosDisponibles = [];
    this.incidente.provincia = '';
    this.incidente.distrito = '';
  }

  onProvinciaChange() {
    const dep = this.departamentosPeru.find(d => d.nombre === this.incidente.departamento);
    if (dep) {
      const prov = dep.provincias.find((p: Provincia) => p.nombre === this.incidente.provincia);
      this.distritosDisponibles = prov ? prov.distritos : [];
    }
    this.incidente.distrito = '';
  }

  
  abrirReloj() {
    this.mostrarReloj = true;
  }

  cambiarHora(delta: number) {
    this.horaSel += delta;
    if (this.horaSel > 12) this.horaSel = 1;
    if (this.horaSel < 1) this.horaSel = 12;
  }

  cambiarMinuto(delta: number) {
    this.minutoSel += delta;
    if (this.minutoSel > 59) this.minutoSel = 0;
    if (this.minutoSel < 0) this.minutoSel = 59;
  }

  setPeriodo(p: 'AM' | 'PM') {
    this.periodoSel = p;
  }

  confirmarHora() {
    const h = this.horaSel < 10 ? `0${this.horaSel}` : `${this.horaSel}`;
    const m = this.minutoSel < 10 ? `0${this.minutoSel}` : `${this.minutoSel}`;
    const p = this.periodoSel === 'AM' ? 'a. m.' : 'p. m.';
    this.incidente.hora = `${h}:${m} ${p}`;
    this.mostrarReloj = false;
  }

  
  ejecutarAcciones() {
    if (this.esFormularioValido) {
      const payloadAlBackend: SolicitudBloqueoPayload = {
        usuarioDni: '75906610',
        lineasIds: this.lineasSeleccionadas.map(linea => linea.id),
        correoNotificacion: this.incidente.correo,

        acciones: {
          bloqueoLinea: this.bloqueoLinea,
          reportePolicia: this.reportePolicia
        },
        
        datosIncidente: this.reportePolicia ? {
          modalidad: this.incidente.modalidad,
          departamento: this.incidente.departamento,
          provincia: this.incidente.provincia,
          distrito: this.incidente.distrito,
          calle: this.incidente.calle,
          referencia: this.incidente.referencia,
          fecha: this.incidente.fecha,
          hora: this.incidente.hora
        } : null
      };

      this.router.navigate(['/blocking-process'], {
        state: { payload: payloadAlBackend, cantidad: this.cantidadAcciones }
      });
    }
  }
}