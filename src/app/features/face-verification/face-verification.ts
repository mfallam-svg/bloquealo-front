import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
    private cdr: ChangeDetectorRef // <-- OBLIGA A ANGULAR A ACTUALIZAR LA PANTALLA
  ) {}

  iniciarVerificacion() {
    this.scanState = 'scanning';
    
    // 1. PRIMER TEMPORIZADOR: El láser escaneando por 3 segundos
    setTimeout(() => {
      
      this.scanState = 'success';
      this.cdr.detectChanges(); // ¡Fuerza el pintado del escudo y fondo rojo YA MISMO!

      // 2. SEGUNDO TEMPORIZADOR (Adentro del primero): 
      // Espera 2.5 segundos admirando el escudo antes de saltar
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2500);

    }, 3000);
  }
}