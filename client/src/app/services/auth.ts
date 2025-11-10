import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://localhost:7043/api/auth';
  private readonly TOKEN_KEY = 'organiza_med_token';

  constructor(private http: HttpClient) { }

  public register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/registrar`, userData);
  }

  public login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/autenticar`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
        }
      })
    );
  }

  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
