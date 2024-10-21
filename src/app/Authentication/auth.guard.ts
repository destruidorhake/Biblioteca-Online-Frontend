import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const userType = this.authService.getUserType();
    const allowedUserTypes = route.data['allowedUserTypes'] as Array<string>;

    // Verifica se o usuário está logado e se o tipo de usuário é permitido
    if (this.authService.isLoggedIn() && userType && allowedUserTypes.includes(userType)) {
      return true; // Permite o acesso
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } }); // Redireciona para login
      return false; // Bloqueia o acesso
    }
  }
}
