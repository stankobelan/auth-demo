import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {User} from "../../Models/User";

@Component({
  selector: 'app-protected',
  standalone: true,
  templateUrl: './protected.component.html',
})
export class ProtectedComponent implements OnInit {
  currentUser: User|null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Retrieve user data from local storage
    let data = localStorage.getItem('userData');
    const userData = data?JSON.parse(data):null;
    if (userData) {
      this.currentUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );

      if (!this.currentUser.token) {
        // Token is invalid or expired
        this.router.navigate(['/auth']);
      }
    } else {
      // No user data found
      this.router.navigate(['/auth']);
    }
  }
}
