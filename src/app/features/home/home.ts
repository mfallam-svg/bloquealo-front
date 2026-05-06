import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  // Variables para el DNI
  dniNumber: string = '';
  
  // Controladores de Vista y Estados
  currentView: 'dni' | 'facial' = 'dni';
  scanState: 'idle' | 'scanning' | 'success' = 'idle';

  constructor(private router: Router) {}

  // Bloquea letras en el input
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

  // Pasa de la vista DNI a la Facial
  continuar() {
    if (this.isDniValid) {
      // Ahora navegamos a la nueva ruta en vez de cambiar la vista
      this.router.navigate(['/face-verification']);
    }
  }

  // Inicia la animación de la cara y redirige al éxito
  iniciarVerificacion() {
    this.scanState = 'scanning';
    
    // Simula 3 segundos de escaneo
    setTimeout(() => {
      this.scanState = 'success';
      
      // Espera 1.5 segundos para que el usuario vea el check verde y viaja al panel
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);

    }, 3000);
  }
}