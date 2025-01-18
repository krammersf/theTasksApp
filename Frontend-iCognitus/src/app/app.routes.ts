import { Routes } from '@angular/router';
import { TaskListComponent } from './Components/tasks/tasks.component';
import { AuthComponent } from './Components/auth/auth.component';
import { AuthGuard } from './Guards/auth.guard';

export const routes: Routes = [
	{ path: '', redirectTo: 'auth', pathMatch: 'full' },
	{ path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
	{ path: 'auth', component: AuthComponent },
];
