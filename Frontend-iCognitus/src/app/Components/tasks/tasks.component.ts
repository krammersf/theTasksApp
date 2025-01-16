// src/app/components/task-list/task-list.component.ts
import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../Services/tasks.service';
import { TaskItem } from '../../Interfaces/tasks';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: TaskItem[] = [];
  isModalOpen = false;
  isEditing = false;
  currentTask: TaskItem = { id: 0, title: '', description: '', status: 'Pendente', createdBy: '', updatedBy: '' };

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe((data) => {
      this.tasks = data;
    });
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
        this.loadTasks();
        this.closeModal();
      });
    } else {
      this.taskService.createTask(this.currentTask).subscribe(() => {
        this.loadTasks();
        this.closeModal();
      });
    }
  }

  // Deletar uma tarefa
  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.loadTasks();
    });
  }
}