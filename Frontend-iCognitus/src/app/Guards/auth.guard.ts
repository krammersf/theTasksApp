import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken(); // Verifica se há token no localStorage

    if (token) {
      return true; // Permite o acesso à rota se o usuário estiver autenticado
    } else {
      // Se o usuário não estiver autenticado, redireciona para a página de login
      this.router.navigate(['/auth']); // Redireciona para a página de login
      return false; // Impede o acesso à rota protegida
    }
  }
}