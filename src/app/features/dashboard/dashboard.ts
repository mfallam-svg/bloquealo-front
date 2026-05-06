import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface LineaMovil {
  id: number;
  numero: string;
  operador: string;
  estado: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {
  lineas: LineaMovil[] = [
    { id: 1, numero: '966 053 100', operador: 'Claro', estado: 'Activo' },
    { id: 2, numero: '987 456 321', operador: 'Movistar', estado: 'Activo' },
    { id: 3, numero: '901 234 567', operador: 'Entel', estado: 'Activo' }
  ];

  // AHORA ES UN ARREGLO PARA MÚLTIPLES SELECCIONES
  lineasSeleccionadasIds: number[] = [];

  constructor(private router: Router) {}

  // Lógica de Toggle: Agrega o quita el ID de la lista
  toggleLinea(id: number) {
    const index = this.lineasSeleccionadasIds.indexOf(id);
    if (index > -1) {
      // Si ya estaba seleccionada, la quitamos
      this.lineasSeleccionadasIds.splice(index, 1);
    } else {
      // Si no estaba, la agregamos
      this.lineasSeleccionadasIds.push(id);
    }
  }

  // Verifica si la tarjeta debe pintarse de rojo
  esSeleccionada(id: number): boolean {
    return this.lineasSeleccionadasIds.includes(id);
  }

  continuar() {
    // Si hay al menos 1 línea seleccionada, permite continuar
    if (this.lineasSeleccionadasIds.length > 0) {
      
      // 1. Filtramos las líneas completas basándonos en los IDs seleccionados
      const lineasAEnviar = this.lineas.filter(linea => 
        this.lineasSeleccionadasIds.includes(linea.id)
      );

      // 2. Navegamos a la siguiente ruta pasando las líneas en el "state"
      this.router.navigate(['/security-measures'], { 
        state: { lineas: lineasAEnviar } 
      });
      
    }
  }
}