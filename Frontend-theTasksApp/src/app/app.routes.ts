import { Routes } from '@angular/router';
import { TaskListComponent } from './Components/tasks/tasks.component';
import { AuthComponent } from './Components/auth/auth.component';
import { TaskDetailComponent } from './Components/task-detail/task-detail.component';
import { AuthGuard } from './Guards/auth.guard';

export const routes: Routes = [
	{ path: '', redirectTo: 'auth', pathMatch: 'full' },
	{ path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
	{ path: 'tasks/:id', component: TaskDetailComponent, canActivate: [AuthGuard] },
	{ path: 'auth', component: AuthComponent },
	{ path: '**', redirectTo: 'auth' },
];
