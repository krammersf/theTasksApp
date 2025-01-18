import { Routes } from '@angular/router';
import { TaskListComponent } from './Components/tasks/tasks.component';
import { AuthComponent } from './Components/auth/auth.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'auth', pathMatch: 'full' },
	{ path: 'tasks', component: TaskListComponent },
	{ path: 'auth', component: AuthComponent },
];
