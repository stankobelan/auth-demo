import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatError } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';

interface ToDo {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-edit-task',
  standalone: true,
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css'],
  imports: [
    NgIf,
    FormsModule,    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    FlexLayoutModule
  ]
})
export class EditTaskComponent implements OnInit {
  task!: ToDo;
  isLoading = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Use the resolved task data directly from the route
    this.task = this.route.snapshot.data['task'];
  }

  // Update the task using PUT request
  updateTask(): void {
    if (this.task.title.trim()) {
      this.isLoading = true;
      this.http
        .put<ToDo>(
          `https://my-json-server.typicode.com/stankobelan/demo/todos/${this.task.id}`,
          this.task
        )
        .subscribe({
          next: (response) => {
            console.log('Task updated:', response);
            this.isLoading = false;
            alert('Task updated successfully!');
            this.router.navigate(['/tasks']);
          },
          error: (error) => {
            console.error('Error updating task:', error);
            this.isLoading = false;
            this.errorMessage = 'Failed to update task. Please try again.';
          },
        });
    } else {
      alert('Task title cannot be empty.');
    }
  }

  // Cancel editing and return to the tasks list
  cancelEdit(): void {
    this.router.navigate(['/tasks']);
  }
}
