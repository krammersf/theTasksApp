import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {

	constructor(private authService: AuthService, private router: Router) {}

	canActivate(): boolean {
		const token = this.authService.getToken();
		//console.log('Token no guard:', token);
	
		if (token) {
			return true;
		} else {
			this.router.navigate(['/auth']);
			return false;
		}
	}
}