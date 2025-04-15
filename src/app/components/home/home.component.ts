import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from "../../Models/User";
import { NgForOf } from "@angular/common";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import { EditTaskDialogComponent } from '../../dialogs/edit-task-dialog/edit-task-dialog.component';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
interface Task {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [
    NgForOf,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    FlexLayoutModule
  ]
})
export class HomeComponent implements OnInit {
  todos: Todo[] = [];
  currentUser: User | null = null;

  constructor(private http: HttpClient, private router: Router,private dialog: MatDialog) {}

  ngOnInit(): void {
    // Retrieve user data from local storage
    let data = localStorage.getItem('userData');
    const userData = data ? JSON.parse(data) : null;
    if (userData) {
      console.log(`HomeComponent ngOnInit() = ${data}`);
      this.currentUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );

      if (this.currentUser.token) {
        // User is authenticated, proceed to fetch data
        this.fetchTodos();
      } else {
        console.error('Token expired');
        this.router.navigate(['/auth']);
      }
    } else {
      console.error('User is not authenticated');
      this.router.navigate(['/auth']);
    }
  }

  fetchTodos() {
    this.http
      .get<Todo[]>('https://my-json-server.typicode.com/stankobelan/demo/todos')
      .subscribe({
        next: (resData) => {
          this.todos = resData;
        },
        error: (error) => {
          console.error('Error fetching data', error);
          // Handle unauthorized error (e.g., redirect to login)
          if (error.status === 401 || error.status === 403) {
            this.router.navigate(['/auth']);
          }
        },
      });
  }

  // Method to navigate to the edit page for the selected Todo
  editTodo(todoId: number): void {
    //this.router.navigate(['/tasks/edit', todoId]);
    this.http.get<Task>(`https://my-json-server.typicode.com/stankobelan/demo/todos/${todoId}`)
    .subscribe(todo =>{
      const dialogRef = this.dialog.open(EditTaskDialogComponent, {
        data: todo,
        width: '400px',
        height: '300px',  
        panelClass: 'custom-dialog-alt',     
        disableClose: false,        
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // HTTP PUT na aktualizáciu úlohy
          this.http.put<Task>(`https://my-json-server.typicode.com/stankobelan/demo/todos/${todoId}`, result)
            .subscribe(updatedTask => {
              // aktualizácia dát v UI po úspechu
              const index = this.todos.findIndex(t => t.id === todoId);
              if (index !== -1) {
                this.todos[index] = updatedTask;
              }
            });
          }
        });
      });
  }
}
