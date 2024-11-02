import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../configuration/environments/environment.dev';
import { ProfessorDTO } from '../../models/usuarios.models';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = `${environment.local}/professores`;

  constructor(private http: HttpClient) {}


   // Método para registrar um novo professor
   registrarProfessor(professor: ProfessorDTO): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(this.apiUrl, professor, { headers });
  }

  // Método para buscar todos os professores (opcional, caso necessário no front-end)
  getAllProfessores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
