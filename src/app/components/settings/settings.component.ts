import { Component } from '@angular/core';
import { NgForOf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from '@angular/material/checkbox'; // added material checkbox

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    MatCheckboxModule // added material module
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  // Basic settings logic
  settings = [
    { name: 'Enable Notifications', enabled: true },
    { name: 'Dark Mode', enabled: false }
  ];
}

