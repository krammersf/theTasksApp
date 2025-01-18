import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  registerData = { username: '', email:'', password: '' };
  loginData = { email: '', password: '' };
  mode: 'tasks' | 'login' | 'register' = 'tasks';
  errorMessage: string | null = null; 
  successMessage: string | null = null;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) { }

  setMode(mode: 'tasks' | 'login' | 'register'): void {
    this.mode = mode;
    this.errorMessage = null;
    this.successMessage = null;
  }

  onRegister(): void {
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        console.log('User registered:', response);
        this.successMessage = "Registration successful!";
        this.clearSuccessMessageAfterDelay1();
      },
      error: (error) => {
        console.error('Error registering:', error);
  
        // Verificar se error.error se resolve para '[object Object]'
        const isObjectObject = error.error && error.error.toString() === '[object Object]';
  
        // Mensagem de erro com base na verificação
        this.errorMessage = isObjectObject
          ? 'Registration failed:\n All fields must be filled.'
          : `Registration failed:\n${error.error || 'Unknown error'}`;
  
        this.clearErrorMessageAfterDelay();
      }
    });
  }

  // onRegister(): void {
  //   this.authService.register(this.registerData).subscribe({
  //     next: (response) => {
  //       console.log('User registered:', response);
  //       this.successMessage = "Registration successful!";
  //       this.clearSuccessMessageAfterDelay1(); 
  //     },
  //     error: (error) => {
  //       console.error('Error registering:', error);
  
  //       // Capturar mensagem de erro personalizada ou fallback para erro desconhecido
  //       this.errorMessage = error.error?.message || 'Registration failed: Unknown error';
  //       this.clearErrorMessageAfterDelay();
  //     }
  //   });
  // }

  onLogin(): void {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('User logged in:', response);
        localStorage.setItem('authToken', response.token); // Armazenar o token aqui
  
        // Decodificar o token JWT para obter o 'username' e o 'email'
        const decodedToken: any = jwt_decode(response.token);
        const username = decodedToken.username; // Extrair 'username' do token
        const email = decodedToken.sub;
        const email2 = decodedToken.email;
        console.log('$$$ email:', username);
        console.log('$$$ email:', email);
        localStorage.setItem('username', username); // Armazenar o username
        localStorage.setItem('email', email); // Armazenar o email
  
        this.successMessage = "Login successful!";
        this.clearSuccessMessageAfterDelay2();
      },
      error: (error) => {
        console.error('Error logging in:', error);
        this.errorMessage = 'Login failed: ' + (error.error.message || 'Unauthorized');
        this.loginData = { email: '', password: '' };
        this.clearErrorMessageAfterDelay();
      }
    });
  }

  clearErrorMessageAfterDelay(): void {
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }

  clearSuccessMessageAfterDelay1(): void {
    setTimeout(() => {
      this.successMessage = null;
      this.setMode('login');
      this.router.navigate(['/auth']);
    }, 2000);
  }

  clearSuccessMessageAfterDelay2(): void {
    setTimeout(() => {
      this.successMessage = null;
      this.router.navigate(['/tasks']);
    }, 2000);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}