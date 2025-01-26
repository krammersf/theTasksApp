import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../Services/tasks.service';
import { TaskItem } from '../../Interfaces/tasks';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'app-task-detail',
	standalone: true,
	imports: [CommonModule, MatCardModule],
	templateUrl: './task-detail.component.html',
	styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
	task: TaskItem | undefined;

	constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router) {}

	ngOnInit(): void {
		window.scrollTo(0, 0);
		const taskId = Number(this.route.snapshot.paramMap.get('id'));
		this.taskService.getTaskById(taskId).subscribe(task => {
			this.task = task;
		});
	}

	goBack(): void {
		this.router.navigate(['/tasks']);
	}
}