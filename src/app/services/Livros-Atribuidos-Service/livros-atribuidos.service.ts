import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../Authentication/environment.dev';
import { Aluno } from '../../models/aluno.model';
import { Livro } from '../../models/livros.model';
import { AlunoLivro } from '../../models/alunoLivro.model';

@Injectable({
  providedIn: 'root'
})
export class LivrosAtribuidosService {
  private apiUrl = `${environment.local}/alunoLivros`;

  constructor(private http: HttpClient) {}

  getAllAlunoLivros(): Observable<AlunoLivro[]> {
    return this.http.get<AlunoLivro[]>(this.apiUrl);
  }

  atribuirLivro(aluno: Aluno, livro: Livro, dataRegistro: string): Observable<any> {
    const data = {
      alunoId: aluno.idAluno,
      alunoNome: aluno.nomeAluno,
      livroId: livro.idLivro,
      livroNome: livro.nomeLivro,
      dataRegistro: dataRegistro
    };

    return this.http.post<any>(this.apiUrl, data).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.message));
      })
    );
  }

  deleteLivro(alunoId: number, livroId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/desatribuir/${alunoId}/${livroId}`)
      .pipe(
        catchError(error => {
          return throwError(() => new Error('Erro ao deletar livro atribuído. Tente novamente mais tarde.'));
        })
      );
  }
}
