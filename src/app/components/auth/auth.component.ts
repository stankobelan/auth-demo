import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HttpClient, } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../Models/User';
import {setCurrentUser} from "../../Models/shared-user";
import {AuthService} from "../../services/auth.service";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatError } from '@angular/material/form-field';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  isLoginMode = true;
  authForm: FormGroup;
  error: string|undefined = undefined;
  private apiKey = 'AIzaSyDXZ9J8GO8wuC_qhrrId3hx5k_k_89_lCQ';
  currentUser: User|undefined = undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = undefined;

  }

  onSubmit() {
    if (!this.authForm.valid) {
      return;
    }
    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    if (this.isLoginMode) {
      console.log("this.login(email, password)");
      this.login(email, password).subscribe({
        next: (resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
          this.router.navigate(['/']);
        },
        error: (errorRes) => {
          this.error = this.handleError(errorRes);
        },
      });
    } else {
      this.signup(email, password).subscribe({
        next: (resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
          this.router.navigate(['/']);
        },
        error: (errorRes) => {
          this.error = this.handleError(errorRes);
        },
      });
    }


    this.authForm.reset();
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    this.currentUser = new User(email, userId, token, expirationDate);
    // Optionally, store user data in local storage for auto-login
    localStorage.setItem('userData', JSON.stringify(this.currentUser));
    setCurrentUser(this.currentUser);
    this.authService.login();
    console.log(`isLoggedIn = ${this.authService.isLoggedIn()}`);
  }


  private signup(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );
  }

  private login(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
      {
        email,
        password,
        returnSecureToken: true,
      });
  }

  private handleError(errorRes: any): string {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return errorMessage;
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email address is already in use!';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist!';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct!';
        break;
    }
    return errorMessage;
  }
  }
