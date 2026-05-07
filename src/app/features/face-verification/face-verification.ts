import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Importamos el servicio y el contrato
import { ApiService } from '../../core/services/api.service';
import { ValidacionReniecPayload, UsuarioReniec } from '../../core/models/bloqueo.models';

@Component({
  selector: 'app-face-verification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './face-verification.html',
  styleUrl: './face-verification.scss'
})
export class FaceVerificationComponent {
  scanState: 'idle' | 'scanning' | 'success' = 'idle';

  constructor(
    private router: Router, 
    private cdr: ChangeDetectorRef, // ¡Agregada la coma que faltaba aquí!
    private apiService: ApiService
  ) {}

  iniciarVerificacion() {
    this.scanState = 'scanning';
    
    // 1. ARMAMOS EL PAYLOAD PARA RENIEC
    // Simulamos que el usuario ingresó este DNI en un input previo
    const payloadLogin: ValidacionReniecPayload = {
      dni: '74125896', 
      biometriaExitosa: true // Asumimos que la cámara captó bien el rostro
    };

    // 2. LLAMAMOS AL SERVICIO SIMULADO (RENIEC)
    // Esto reemplaza tu primer setTimeout. La animación de carga ahora es controlada por la red.
    this.apiService.validarReniec(payloadLogin).subscribe({
      next: (usuarioReniec: UsuarioReniec) => {
        // Reniec respondió con éxito (después del delay simulado de 1.5s)
        console.log('✅ Reniec validó al usuario:', usuarioReniec);
        
        this.scanState = 'success';
        this.cdr.detectChanges(); // Forzamos el pintado del escudo y fondo verde/rojo

        // 3. TEMPORIZADOR VISUAL
        // Esperamos 2.5 segundos admirando el escudo de éxito antes de saltar al Dashboard
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2500);
      },
      error: (err) => {
        console.error('❌ Error al validar con Reniec', err);
        // Si fallara, regresamos al estado inicial
        this.scanState = 'idle';
        this.cdr.detectChanges();
      }
    });
  }
}