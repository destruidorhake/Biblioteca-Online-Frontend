import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../configuration/environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class PratileiraService {

  private apiUrl = `${environment.local}`;

  constructor(private http: HttpClient) { }

  getAllPratileiras(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pratileiras`);
  }
}
