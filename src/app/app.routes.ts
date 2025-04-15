import {AuthComponent} from "./components/auth/auth.component";
import {HomeComponent} from "./components/home/home.component";
import {ProtectedComponent} from "./components/protected/protected.component";
import {Routes} from "@angular/router";
import {AdminComponent} from "./components/admin/admin.component";
import {authChildGuard} from "./guards/auth-child.guard";
import {UserListComponent} from "./components/users/users.component";
import {SettingsComponent} from "./components/settings/settings.component";
import {authGuard} from "./guards/auth.guard";
import {unsavedChangesGuard} from "./guards/unsaved-changes.guard";
import {TaskResolver} from "./resolvers/task-resolver.service";
import {EditTaskComponent} from "./components/tasks/edit-task/edit-task.component";


export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'protected', component: ProtectedComponent },
  {
    path: 'tasks/edit/:id',
    component: EditTaskComponent,
    canActivate: [authGuard],
    canDeactivate: [unsavedChangesGuard],
    resolve: { task: TaskResolver },
  },

  { path: '', component: HomeComponent },
  {
    path: 'admin',
    component: AdminComponent, // Parent component
    canActivate: [authGuard], // Optional: Protect the parent route
    canActivateChild: [authChildGuard], // Protect child routes
    children: [
      { path: 'users', component: UserListComponent },
      { path: 'settings', component: SettingsComponent },
      // ... other child routes
    ],
  },

];
