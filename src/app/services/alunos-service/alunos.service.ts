import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno } from '../../models/aluno.model';
import { environment } from '../../configuration/environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class AlunosService {
  private apiUrl = `${environment.local}/alunos`;

  constructor(private http: HttpClient) {}

  // Método para obter a lista de alunos
  getAlunos(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(this.apiUrl);
  }

  // Método para obter alunos ativos (idAtivo = 1)
  getAlunosAtivos(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(`${this.apiUrl}?ativo=true`);
  }

  // Método para salvar um aluno
  saveAluno(aluno: Omit<Aluno, 'idAluno'>): Observable<Aluno> {
    return this.http.post<Aluno>(this.apiUrl, aluno);
  }

  // Método para deletar um aluno
  deleteAluno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
