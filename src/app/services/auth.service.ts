import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;

  constructor() {}

  // Method to simulate login
  login(): void {

    this.isAuthenticated = true;
    console.log(`login this.isAuthenticated = ${this.isAuthenticated}`);
  }

  // Method to simulate logout
  logout(): void {
    console.log(`logout this.isAuthenticated = ${this.isAuthenticated}`);
    this.isAuthenticated = false;
  }

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    console.log(`isLoggedIn this.isAuthenticated = ${this.isAuthenticated}`);
    return this.isAuthenticated;
  }
}
