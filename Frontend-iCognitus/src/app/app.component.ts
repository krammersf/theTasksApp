import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
 import { provideHttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';  // Importando HttpClientModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule],  // Adicionando o HttpClientModule aqui
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Frontend-iCognitus';
}