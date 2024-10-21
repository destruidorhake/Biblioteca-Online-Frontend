import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.local;

  constructor(private http: HttpClient) {}

  // Verifica se o usuário está logado
  isLoggedIn(): boolean {
    // Verifica se estamos no ambiente de navegador
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      return !!token; // Retorna true se o token existir
    }
    return false; // Retorna false se não estiver no navegador
  }

  // Faz o login do usuário
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/auth/login`, { usuarioProfessor: email, senhaProfessor: password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          console.log('Token:', response.token); // Adicione este log para ver o token
        }),
        catchError(error => {
          console.error('Login failed', error);
          return throwError(error);
        })
      );
  }

  // Obtém o tipo de usuário do token
  getUserType(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Payload do token:', payload); // Adicione este log para verificar o payload
      return payload.userType; // Isso assume que o userType está no payload
    }
    return null;
  }

  // Remove a sessão do usuário
  logout(): void {
    localStorage.removeItem('token'); // Remove o token do localStorage
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
