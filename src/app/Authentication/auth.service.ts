import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from './environment';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.local;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  // Verifica se o usuário está logado
  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      return !!token;
    }
    return false;
  }

  // Faz o login do usuário
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/auth/login`, { usuarioProfessor: email, senhaProfessor: password })
      .pipe(
        tap(response => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
          }
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  // Obtém o tipo de usuário do token
  getUserType(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userType;
      }
    }
    return null;
  }

  // Remove a sessão do usuário
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }

  // Redefine a senha
  resetPassword(usuarioProfessor: string, numeroDocumento: string): Observable<any> {
    const params = new HttpParams()
      .set('usuarioProfessor', usuarioProfessor)
      .set('numeroDocumento', numeroDocumento);

    return this.http.post<any>(`${this.baseUrl}/api/auth/reset-password`, {}, { params });
  }

  getUserSession(): any {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'userSession') {
        return JSON.parse(decodeURIComponent(value));
      }
    }
    return null;
  }

  getToken(): string {
    const userSession = this.getUserSession();
    return userSession ? userSession.token : '';
  }
}
