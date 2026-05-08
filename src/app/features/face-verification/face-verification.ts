import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-face-verification',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './face-verification.html',
  styleUrl: './face-verification.scss'
})
export class FaceVerificationComponent implements OnInit {
  scanState: 'idle' | 'scanning' | 'success' | 'error' = 'idle';
   
  usuarioValidado: any = null; 

  constructor(private router: Router, private apiService: ApiService) {

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['usuario']) {
      this.usuarioValidado = navigation.extras.state['usuario'];
    }
  }

  ngOnInit() {   
    if (!this.usuarioValidado) {
      this.router.navigate(['/']);
    }
  }

  iniciarVerificacion() {
    this.scanState = 'scanning';
   
    setTimeout(() => {
          
      const payload = {
        dni: this.usuarioValidado.dni,
        biometriaExitosa: true
      };

      this.apiService.validarReniec(payload).subscribe({
        next: (res) => {
          this.scanState = 'success';
          setTimeout(() => {            
            this.router.navigate(['/dashboard'], { state: { usuario: this.usuarioValidado } }); 
          }, 1500);
        },
        error: (err) => {
          console.error('Error al validar biometría:', err);
          this.scanState = 'error';
        }
      });
      
    }, 3000);
  }
}