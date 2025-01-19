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
				const decodedToken: any = jwtDecode(token); 
				console.log('Token decodificado:', decodedToken); 
				console.log('Email do token:', decodedToken.sub);
				console.log('Username do token:', decodedToken.username);
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
					sessionStorage.setItem('authToken', response.token);
					console.log('Token armazenado no localStorage:', response.token);
					console.log('Token armazenado no sessionStorage:', response.token);
				}
			})
		);
	}

	logout(): void {
		localStorage.removeItem('authToken');
		sessionStorage.removeItem('authToken');
		console.log('User logged out');
	}

	getTasks() {
		console.log('getTasks() foi chamado');
		const token = localStorage.getItem('authToken');
		console.log('Token recuperado:', token);
		if (!token) {
			console.error('Token não encontrado!');
			return new Observable(observer => observer.error('Token não encontrado!'));
		}
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
		return this.http.get('http://localhost:5288/tasks', { headers });
	}
}