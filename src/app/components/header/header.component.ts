import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {User} from "../../Models/User";
import {getCurrentUser, onUserChange} from "../../Models/shared-user";
import {AuthService} from "../../services/auth.service";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { LogoutConfirmationDialogComponent } from '../../dialogs/logout-confirmation-dialog/logout-confirmation-dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, MatToolbarModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: User|null = null;

  constructor(private router: Router, private authService:AuthService, private dialog:MatDialog) {  }

  ngOnInit(): void {
    this.currentUser = getCurrentUser();
    onUserChange(user => {
      this.currentUser = user;
    });
  }

  onLogout() {

    const dialogRef = this.dialog.open(LogoutConfirmationDialogComponent, {
      width: '300px',
      height: '200px',     
      panelClass: 'custom-dialog',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Clear user data from local storage
        localStorage.removeItem('userData');
        this.authService.logout();
        // Reload the application to reset state
        window.location.reload();
      }
    });

  }
}
