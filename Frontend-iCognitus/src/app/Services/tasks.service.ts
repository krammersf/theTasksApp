import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskItem } from '../Interfaces/Tasks';

@Injectable({
	providedIn: 'root',
})
export class TaskService {

	private apiUrl = 'http://localhost:5288/tasks';

	constructor(private http: HttpClient) { }

	private getHeaders(): HttpHeaders {
		const token = localStorage.getItem('authToken');
		const username = localStorage.getItem('username');
		console.log('### Token:', token);
		console.log('### Username:', username);
		console.log('### email:', localStorage.getItem('email'));
		if (!token) {
			throw new Error('Token não encontrado!');
		}
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
		return username ? headers.set('X-Username', username) : headers;
	}

	getAllTasks(): Observable<TaskItem[]> {
		return this.http.get<TaskItem[]>(this.apiUrl, { headers: this.getHeaders() });
	}

	getPendentes(): Observable<TaskItem[]> {
		return this.http.get<TaskItem[]>(`${this.apiUrl}/pendentes`, { headers: this.getHeaders() });
	}

	getEmProgresso(): Observable<TaskItem[]> {
		return this.http.get<TaskItem[]>(`${this.apiUrl}/emprogresso`, { headers: this.getHeaders() });
	}

	getConcluida(): Observable<TaskItem[]> {
		return this.http.get<TaskItem[]>(`${this.apiUrl}/concluida`, { headers: this.getHeaders() });
	}

	getTaskById(id: number): Observable<TaskItem> {
		return this.http.get<TaskItem>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
	}

	createTask(taskItem: TaskItem): Observable<TaskItem> {
		const username = localStorage.getItem('username');
		if (username) {
			taskItem.createdBy = username;
		}

		return this.http.post<TaskItem>(this.apiUrl, taskItem, {
			headers: this.getHeaders().set('Content-Type', 'application/json')
		});
	}

	updateTask(id: number, taskItem: TaskItem): Observable<TaskItem> {
		const username = localStorage.getItem('username');
		if (username) {
			taskItem.updatedBy = username;
		}

		return this.http.put<TaskItem>(`${this.apiUrl}/${id}`, taskItem, {
			headers: this.getHeaders().set('Content-Type', 'application/json')
		});
	}

	deleteTask(id: number): Observable<void> {
		return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
	}
}