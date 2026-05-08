import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ChangeDetectorRef } from '@angular/core'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  
  dniNumber: string = '';    
  currentView: 'dni' | 'facial' = 'dni';
  scanState: 'idle' | 'scanning' | 'success' = 'idle';

 
  mostrarModalError: boolean = false;
  mensajeError: string = '';
  estaCargando: boolean = false; 

 
  constructor(private router: Router, private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  
  permitirSoloNumeros(event: KeyboardEvent) {
    const charCode = event.key;
    if (!/^[0-9]$/.test(charCode)) {
      event.preventDefault();
    }
  }

  onDniChange(value: string) {
    this.dniNumber = value.replace(/\D/g, '').slice(0, 8);
  }

  get isDniValid(): boolean {
    return this.dniNumber.length === 8;
  }

  get showDniError(): boolean {
    return this.dniNumber.length > 0 && this.dniNumber.length < 8;
  }

 
  continuar() {
    if (this.isDniValid) {
      this.estaCargando = true;
      this.cdr.detectChanges(); 
      
      const payload = { dni: this.dniNumber, biometriaExitosa: false };

      this.apiService.validarReniec(payload).subscribe({
        next: (usuario) => {
          this.estaCargando = false;
         
          this.router.navigate(['/face-verification'], { state: { usuario } });
        },
        error: (err) => {
          console.error("Detalle del error:", err); 
          this.estaCargando = false;
          
        
          if (err.name === 'HttpErrorResponse' && err.status === 0) {
            this.mensajeError = 'No se pudo conectar al servidor. Verifica que json-server esté encendido.';
          } else {
            this.mensajeError = err.message || 'Usuario no encontrado.';
          }
          
          this.mostrarModalError = true;
          this.cdr.detectChanges(); 
        }
      });
    }
  }

  iniciarVerificacion() {
    this.scanState = 'scanning';
    
    setTimeout(() => {
      this.scanState = 'success';
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
    }, 3000);
  }
}