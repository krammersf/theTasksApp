import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5288/api/auth'; // URL do backend

  constructor(private http: HttpClient) { }

  getUsername(): string {
    return localStorage.getItem('username') || 'Unknown';
  }

  getToken(): string | null {
    const token = localStorage.getItem('authToken');
    if (token) {
      console.log('Token armazenado:', token);

      try {
        const decodedToken: any = jwtDecode(token); // Decodifica o token
        console.log('Token decodificado:', decodedToken); // Exibe o conteúdo do token (Payload)

        // Agora, vamos imprimir email e username
        console.log('Email do token:', decodedToken.sub); // "sub" é o campo do email
        console.log('Username do token:', decodedToken.username); // "username" é o campo do nome de usuário

      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
      }
    }
    return token;
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          console.log('Token armazenado no localStorage:', response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    console.log('User logged out');
  }

  // getTasks(): Observable<any> {
  //   const token = this.getToken();
  //   if (!token) {
  //     console.error('Token não encontrado!');
  //     return new Observable(observer => observer.error('Token não encontrado!'));
  //   }

  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`
  //   });

  //   return this.http.get('http://localhost:5288/tasks', { headers });
  // }

  getTasks() {
    console.log('getTasks() foi chamado');
    const token = localStorage.getItem('authToken');
    console.log('Token recuperado:', token);  // Verifique se o token está sendo recuperado corretamente.
  
    if (!token) {
      console.error('Token não encontrado!');
      return new Observable(observer => observer.error('Token não encontrado!'));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get('http://localhost:5288/tasks', { headers });
  }
}