import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../Authentication/environment.dev';
import { Livro } from '../../models/livros.model';

@Injectable({
  providedIn: 'root'
})
export class LivrosService {
  private apiUrl = `${environment.local}`;

  constructor(private http: HttpClient) {}

  saveLivro(livroData: Livro): Observable<Livro> {
    return this.http.post<Livro>(`${this.apiUrl}/livros`, livroData)
      .pipe(
        catchError(error => {
          return throwError(() => new Error('Erro ao salvar livro. Tente novamente mais tarde.'));
        })
      );
  }

  updateLivro(id: number, livroData: Livro): Observable<Livro> {
    return this.http.put<Livro>(`${this.apiUrl}/livros/${id}`, livroData)
      .pipe(
        catchError(error => {
          return throwError(() => new Error('Erro ao atualizar livro. Tente novamente mais tarde.'));
        })
      );
  }

  updateSequenciaLivro(id: number, novaSequencia: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/livros/sequencia/${id}`, novaSequencia)
    .pipe(
      catchError(error => {
        return throwError(() => new Error('Erro ao atualizar sequência do livro. Tente novamente mais tarde.'));
      })
    );
}

  updateQuantidadeLivro(id: number, livroAtualizado: Livro): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/livros/quantidade/${id}`, livroAtualizado)
      .pipe(
        catchError(error => {
          return throwError(() => new Error('Erro ao atualizar quantidade do livro. Tente novamente mais tarde.'));
        })
      );
  }

  getLivros(): Observable<Livro[]> {
    return this.http.get<Livro[]>(`${this.apiUrl}/livros`)
      .pipe(
        catchError(error => {
          return throwError(() => new Error('Erro ao buscar livros. Tente novamente mais tarde.'));
        })
      );
  }

  getSequenciaLivros(id: number): Observable<{ idLivro: number; sequencia: number }> {
    return this.http.get<{ idLivro: number; sequencia: number }>(`${this.apiUrl}/livros/sequencia/${id}`)
    .pipe(
      catchError(error => {
        return throwError(() => new Error('Erro ao buscar sequência de livros. Tente novamente mais tarde.'));
      })
    );
}

  deleteLivro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/livros/${id}`)
      .pipe(
        catchError(error => {
          return throwError(() => new Error('Erro ao deletar livro. Tente novamente mais tarde.'));
        })
      );
  }

  deleteLivroCadastrado(id: number) {
    return this.http.delete(`${this.apiUrl}/livros/${id}`);
  }

  getLivroByNome(nomeLivro: string): Observable<Livro[]> {
    return this.http.get<Livro[]>(`${this.apiUrl}/livros?nomeLivro=${encodeURIComponent(nomeLivro)}`)
      .pipe(
        catchError(error => {
          return throwError(() => new Error('Erro ao buscar livro por nome. Tente novamente mais tarde.'));
        })
      );
  }

  getLivroById(id: number): Observable<Livro> {
    return this.http.get<Livro>(`${this.apiUrl}/livros/${id}`)
    .pipe(
      catchError(error => {
        return throwError(() => new Error('Erro ao buscar livro por ID. Tente novamente mais tarde.'));
      })
    );
}
}
