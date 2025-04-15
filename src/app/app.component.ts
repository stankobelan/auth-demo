import {Component, OnDestroy, OnInit} from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { User } from './Models/User';
import { RouterOutlet, Router } from '@angular/router';
import { clearCache } from './interceptors/caching.Interceptor';
import {getCurrentUser, setCurrentUser} from "./Models/shared-user";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit , OnDestroy{
  currentUser:User|null = null;
  private tokenExpirationTimer: any;

  constructor(private router: Router) {
    this.currentUser = getCurrentUser();
  }

  ngOnDestroy(): void {

    }

  ngOnInit(): void {
    // Retrieve user data from local storage
    const data = localStorage.getItem('userData');
    const userData = data ? JSON.parse(data) : null;
    if (userData) {
      console.log(`AppComponent ngOnInit() = ${data}`);
      const user = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );
      setCurrentUser(user);


      // Check if token is valid
      if (user.token) {
        const expirationDuration =
          new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.autoLogout(expirationDuration);
      } else {
        setCurrentUser(null);
        localStorage.removeItem('userData');
      }
    }
  }

  private autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      // Clear user data
      localStorage.removeItem('userData');
      setCurrentUser(null);
      clearCache();
      // Redirect to the login page to reset state
      this.router.navigate(['/auth']);
    }, expirationDuration);
  }
}
