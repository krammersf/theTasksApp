import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskItem } from '../Interfaces/tasks';

@Injectable({
  providedIn: 'root',  // O serviço está sendo fornecido globalmente
})
export class TaskService {

  private apiUrl = 'http://localhost:5288/tasks';

  constructor(private http: HttpClient) { }

  // Método auxiliar para obter os cabeçalhos com o token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    console.log('### Token:', token);  // Verifique se o token está armazenado corretamente
    console.log('### Username:', username);  // Verifique se o username está correto
    console.log('### email:', localStorage.getItem('email'));  // Verifique o email também
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
    // Enviar o username no corpo da requisição, junto com a tarefa
    const username = localStorage.getItem('username');
    if (username) {
      taskItem.createdBy = username; // Supondo que 'createdBy' seja um campo que o backend espera
    }

    return this.http.post<TaskItem>(this.apiUrl, taskItem, {
      headers: this.getHeaders().set('Content-Type', 'application/json')
    });
  }

  updateTask(id: number, taskItem: TaskItem): Observable<TaskItem> {
    // Enviar o username no corpo da requisição para atualização
    const username = localStorage.getItem('username');
    if (username) {
      taskItem.updatedBy = username; // Supondo que 'updatedBy' seja um campo que o backend espera
    }

    return this.http.put<TaskItem>(`${this.apiUrl}/${id}`, taskItem, {
      headers: this.getHeaders().set('Content-Type', 'application/json')
    });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}