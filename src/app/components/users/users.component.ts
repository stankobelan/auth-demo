import { Component } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {EditProfileComponent} from "../edit-profile/edit-profile.component";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    NgForOf,
    EditProfileComponent,
    NgIf,
    MatCardModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UserListComponent {
  users = [
    { name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
    { name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Editor' },
    { name: 'Michael Johnson', email: 'michael.johnson@example.com', role: 'Viewer' }
  ];
  protected profileData: any = null;

  editUser(user: any) {
    this.profileData = { ...user };
  }
}

