import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatDialogModule, MatToolbarModule, MatIconModule],  // Adicionando o HttpClientModule aqui
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'The Tasks APP';
  currentUrl: string = '';

  constructor(private router: Router) {
    // Observar mudanças na URL para decidir quando mostrar o botão
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;  // Atualiza a URL atual
    });
  }

  logout(): void {
    console.log('Logout executado');
    // Adicione aqui a lógica de logout
    this.router.navigate(['/']);  // Redireciona para a página inicial após logout
  }
}