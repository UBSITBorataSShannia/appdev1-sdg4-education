import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = signal<boolean>(
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('sdg4_user') !== null
      : false
  );

  isLoggedIn(): boolean {
    return this.loggedIn();
  }

  login(username: string): void {
    localStorage.setItem('sdg4_user', username);
    this.loggedIn.set(true);
  }

  logout(): void {
    localStorage.removeItem('sdg4_user');
    this.loggedIn.set(false);
  }

  getUsername(): string | null {
    return localStorage.getItem('sdg4_user');
  }
}