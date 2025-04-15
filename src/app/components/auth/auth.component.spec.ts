import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComponent } from './auth.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

class MockAuthService {
  login() {}
  isLoggedIn() { return true; }
}

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AuthComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        // Updated RouterTestingModule usage to avoid deprecation warning
        RouterTestingModule.withRoutes([]),
      ],
      providers: [{ provide: AuthService, useClass: MockAuthService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.authForm).toBeDefined();
    expect(component.authForm.get('email')?.value).toBe('');
    expect(component.authForm.get('password')?.value).toBe('');
  });

  it('should toggle between login and signup mode', () => {
    expect(component.isLoginMode).toBeTrue();
    component.onSwitchMode();
    expect(component.isLoginMode).toBeFalse();
    component.onSwitchMode();
    expect(component.isLoginMode).toBeTrue();
  });

  it('should handle successful login by storing user data, calling authService.login, and navigating home', () => {
    // Spy on localStorage.setItem, AuthService.login and router.navigate.
    spyOn(localStorage, 'setItem');
    spyOn(authService, 'login').and.callThrough();
    spyOn(router, 'navigate').and.stub();

    // Prepare the form with valid login data.
    component.isLoginMode = true;
    component.authForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    // Create a mock response that would be returned by the login HTTP call.
    const mockResponse = {
      email: 'test@example.com',
      localId: 'user123',
      idToken: 'token123',
      expiresIn: '3600',
    };

    // Override the private login method to simulate a successful HTTP response.
    component['login'] = jasmine.createSpy().and.returnValue(of(mockResponse));

    // Call onSubmit which will trigger the login path.
    component.onSubmit();

    // Verify that after a successful login the side effects occur.
    expect(authService.login).toHaveBeenCalled(); // verifies AuthService.login got called in handleAuthentication
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'userData',
      jasmine.any(String)
    );
    expect(component.authForm.value).toEqual({ email: null, password: null });
  });


  it('should handle login error', () => {
    component.isLoginMode = true;
    component.authForm.setValue({
      email: 'invalid@example.com',
      password: 'wrongpassword',
    });

    const mockErrorResponse = {
      error: { error: { message: 'INVALID_PASSWORD' } },
    };

    component['login'] = jasmine
      .createSpy()
      .and.returnValue(throwError(mockErrorResponse));

    component.onSubmit();

    expect(component.error).toBe('This password is not correct!');
  });

  it('should handle successful signup without spying on handleAuthentication', () => {
    // Spy on side effects.
    spyOn(localStorage, 'setItem');
    spyOn(authService, 'login').and.callThrough();
    spyOn(router, 'navigate').and.stub();

    // Prepare the component for signup.
    component.isLoginMode = false;
    component.authForm.setValue({
      email: 'newuser@example.com',
      password: 'password123',
    });

    const mockResponse = {
      email: 'newuser@example.com',
      localId: 'user456',
      idToken: 'token456',
      expiresIn: '3600',
    };

    // Override the private signup method to simulate an HTTP response.
    component['signup'] = jasmine.createSpy().and.returnValue(of(mockResponse));

    component.onSubmit();

    // Verify that local storage is updated.
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'userData',
      jasmine.any(String)
    );
    // Verify that AuthService.login was called as part of setting the current user.
    expect(authService.login).toHaveBeenCalled();
    // Verify that the user is navigated home.
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    // Verify that the form has been reset.
    expect(component.authForm.value).toEqual({ email: null, password: null });
  });

  it('should handle signup error', () => {
    component.isLoginMode = false;
    component.authForm.setValue({
      email: 'existing@example.com',
      password: 'password123',
    });

    const mockErrorResponse = {
      error: { error: { message: 'EMAIL_EXISTS' } },
    };

    component['signup'] = jasmine
      .createSpy()
      .and.returnValue(throwError(mockErrorResponse));

    component.onSubmit();

    expect(component.error).toBe('This email address is already in use!');
  });

  it('should handle EMAIL_NOT_FOUND error correctly', () => {
    const errorResponse = { error: { error: { message: 'EMAIL_NOT_FOUND' } } };
    const errorMessage = component['handleError'](errorResponse);
    expect(errorMessage).toBe('This email does not exist!');
});

  it('should handle unknown errors correctly', () => {
    const errorMessage = component['handleError']({});
    expect(errorMessage).toBe('An unknown error occurred!');
  });

  it('should not submit if the form is invalid', () => {
    // Make form invalid by providing improper email and too-short password.
    spyOn<any>(component, 'login');
    spyOn<any>(component, 'signup');

    component.authForm.setValue({
      email: 'not-an-email',
      password: '123'
    });
    
    component.onSubmit();
    
    // Since the form is invalid, neither login nor signup should be called.
    expect((component as any).login).not.toHaveBeenCalled();
    expect((component as any).signup).not.toHaveBeenCalled();
    // The form is not reset when it's invalid.
    expect(component.authForm.value).toEqual({
      email: 'not-an-email',
      password: '123'
    });
  });

  it('should not submit when authForm is invalid due to empty fields', () => {
    // Prevent any side effects for an invalid form.
    spyOn<any>(component, 'login');
    spyOn<any>(component, 'signup');
  
    // Set the form with empty strings which are invalid due to required validators.
    component.authForm.setValue({ email: '', password: '' });
    component.onSubmit();
  
    // Verify that neither login nor signup is called and the form remains unchanged.
    expect((component as any).login).not.toHaveBeenCalled();
    expect((component as any).signup).not.toHaveBeenCalled();
    expect(component.authForm.value).toEqual({ email: '', password: '' });
  });
  
  it('should not submit when authForm is invalid due to incorrect email format or short password', () => {
    // Spy on the login method to ensure it is not called.
    spyOn<any>(component, 'login');
    spyOn<any>(component, 'signup');
  
    // Set an invalid email and a valid-length password.
    component.authForm.setValue({ email: 'invalid-email', password: '123456' });
    component.onSubmit();
    expect((component as any).login).not.toHaveBeenCalled();
    expect((component as any).signup).not.toHaveBeenCalled();
  
    // Set a valid email and too-short password.
    component.authForm.setValue({ email: 'test@example.com', password: '123' });
    component.onSubmit();
    expect((component as any).login).not.toHaveBeenCalled();
    expect((component as any).signup).not.toHaveBeenCalled();
  });
});


