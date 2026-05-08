import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { LineaMovil } from '../../core/models/bloqueo.models';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  lineas: LineaMovil[] = [];
  lineasSeleccionadasIds: number[] = [];
  cargandoLineas: boolean = true; 
    
  usuarioActivo: any = null;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef 
  ) {
    
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['usuario']) {
      this.usuarioActivo = navigation.extras.state['usuario'];
    }
  }

  ngOnInit() {
    
    if (!this.usuarioActivo) {
      this.router.navigate(['/']);
      return;
    }
   
    const dniUsuarioLogueado = this.usuarioActivo.dni;

    this.apiService.obtenerLineasUsuario(dniUsuarioLogueado).subscribe({
      next: (datosDelBackend) => {
        this.lineas = datosDelBackend;
        this.cargandoLineas = false;
        
        this.cdr.detectChanges(); 
      },
      error: (error) => {
        console.error('Hubo un error al conectar con el servidor', error);
        this.cargandoLineas = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleLinea(id: number) {
    const index = this.lineasSeleccionadasIds.indexOf(id);
    if (index > -1) {
      this.lineasSeleccionadasIds.splice(index, 1);
    } else {
      this.lineasSeleccionadasIds.push(id);
    }
  }

  esSeleccionada(id: number): boolean {
    return this.lineasSeleccionadasIds.includes(id);
  }

  continuar() {
    if (this.lineasSeleccionadasIds.length > 0) {
      const lineasAEnviar = this.lineas.filter(linea => 
        this.lineasSeleccionadasIds.includes(linea.id)
      );
      this.router.navigate(['/security-measures'], { 
    
        state: { 
          lineas: lineasAEnviar,
          usuario: this.usuarioActivo 
        } 
      });
    }
  }
}