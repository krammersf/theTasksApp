// src/app/components/task-list/task-list.component.ts
import { Component, OnInit, ViewChild, ViewEncapsulation  } from '@angular/core';
import { TaskService } from '../../Services/tasks.service';
import { TaskItem } from '../../Interfaces/Tasks';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
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
import { Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';


import { MessageService } from '../../Services/message.service';




@Component({
  selector: 'app-tasks',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    FormsModule,
    CommonModule,
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
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: TaskItem[] = [];
  filteredTasks: TaskItem[] = [];
  isModalOpen = false;
  isEditing = false;
  successMessage: string | null = null;
  private tokenKey = 'authToken'; 
  dataSource!: MatTableDataSource<TaskItem>; 

  displayedColumns: string[] = ['title', 'description', 'status', 'createdBy', 'updatedBy', 'actions'];
  currentTask: TaskItem = { id: 0, title: '', description: '', status: 'Pendente', createdBy: '', updatedBy: '' };
  selectedStatus: string = 'Todos'; // Status selecionado na dropbox
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private taskService: TaskService, private dialog: MatDialog,  private messageService: MessageService, private router: Router ) {}

  ngOnInit(): void {
    const tokenLocalStorage = localStorage.getItem(this.tokenKey);
    const tokenSessionStorage = sessionStorage.getItem(this.tokenKey);
    console.log('Token no localStorage:', tokenLocalStorage);
    console.log('Token no sessionStorage:', tokenSessionStorage);

    const token = tokenLocalStorage || tokenSessionStorage;
    console.log('==>>>Token:', token);

    if (!token) {
      this.router.navigate(['/auth']);
    }
    this.dataSource = new MatTableDataSource(); 
    this.loadTasks();
  }


  // Carregar tarefas com base no status selecionado
  loadTasks(): void {
    console.log('### Status Selecionado:', this.selectedStatus);
  
    if (this.selectedStatus === 'Todos') {
      console.log('### Carregando todas as tarefas');
      this.taskService.getAllTasks().subscribe((data) => {
        console.log('### Dados recebidos (Todos):', data);
        this.tasks = [...data];  // Usando spread operator para garantir que uma nova referência seja criada
  
        // Inicializar o MatTableDataSource
        this.dataSource = new MatTableDataSource(this.tasks);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    } else if (this.selectedStatus === 'Pendente') {
      console.log('### Carregando tarefas Pendentes');
      this.taskService.getPendentes().subscribe((data) => {
        console.log('### Dados recebidos (Pendente):', data);
        this.tasks = [...data];
  
        // Inicializar o MatTableDataSource
        this.dataSource = new MatTableDataSource(this.tasks);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    } else if (this.selectedStatus === 'Em Progresso') {
      console.log('### Carregando tarefas Em Progresso');
      this.taskService.getEmProgresso().subscribe((data) => {
        console.log('### Dados recebidos (Em Progresso):', data);
        this.tasks = [...data];
  
        // Inicializar o MatTableDataSource
        this.dataSource = new MatTableDataSource(this.tasks);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    } else if (this.selectedStatus === 'Concluída') {
      console.log('### Carregando tarefas Concluídas');
      this.taskService.getConcluida().subscribe((data) => {
        console.log('### Dados recebidos (Concluída):', data);
        this.tasks = [...data];
  
        // Inicializar o MatTableDataSource
        this.dataSource = new MatTableDataSource(this.tasks);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }

  // Método chamado quando o status da dropdown é alterado
  onStatusChange(): void {
    console.log('### Status alterado:', this.selectedStatus); // Verifique o novo valor de selectedStatus
    if (!this.selectedStatus || this.selectedStatus === 'Todos') {
      // Carregar todas as tarefas
      this.loadTasks();
    } else {
      // Carregar tarefas com o status específico
      this.loadTasks();
    }
  }

  filterChange(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  // Abrir o modal para criar uma nova tarefa
  openCreateTaskModal(): void {
    this.isEditing = false;
    this.currentTask = { id: 0, title: '', description: '', status: 'Pendente', createdBy: '', updatedBy: '' };
    this.isModalOpen = true;
  }

  // Abrir o modal para editar uma tarefa
  openEditTaskModal(task: TaskItem): void {
    this.isEditing = true;
    this.currentTask = { ...task };
    this.isModalOpen = true;
  }

  // Fechar o modal
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Submeter o formulário para criar ou editar a tarefa
  onSubmit(): void {
    if (this.isEditing) {
      this.taskService.updateTask(this.currentTask.id, this.currentTask).subscribe(() => {
        this.messageService.showSnackbar('The task was updateded with success!', 'success');
        this.loadTasks();
        this.clearSuccessMessageAfterDelay();
        this.closeModal();
      });
    } else {
      this.taskService.createTask(this.currentTask).subscribe(() => {
        this.messageService.showSnackbar('The task was created with success!', 'success');
        this.loadTasks();
        this.clearSuccessMessageAfterDelay();
        this.closeModal();
      });
    }
  }

  deleteTask(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
      data: { message: 'Tem certeza que deseja excluir esta tarefa?' }
      
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(id).subscribe(() => {
          this.loadTasks(); 
          this.messageService.showSnackbar('The task was deleted with success!', 'success');
        });
      }
    });
    
  }

  clearSuccessMessageAfterDelay(): void {
    setTimeout(() => {
      this.successMessage = null;

    }, 2000);
  }

  // Deletar uma tarefa
  // deleteTask(id: number): void {
  //   this.taskService.deleteTask(id).subscribe(() => {
  //     this.loadTasks();
  //   });
  // }
}