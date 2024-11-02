import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../configuration/environments/environment.dev';
import { GeneroTextual, GeneroLinguistico } from '../../models/generos.model';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {
  private apiUrl = `${environment.local}/generos`;

  constructor(private http: HttpClient) {

  }

  getGenerosTextuais(): Observable<GeneroTextual[]> {
    return this.http.get<GeneroTextual[]>(`${this.apiUrl}/textuais`);
  }

  getGenerosLinguisticos(): Observable<GeneroLinguistico[]> {
    return this.http.get<GeneroLinguistico[]>(`${this.apiUrl}/linguisticos`);
  }
}
