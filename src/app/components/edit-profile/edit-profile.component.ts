import {Component, Input} from '@angular/core';
import {CanComponentDeactivate} from "../../guards/unsaved-changes.guard";
import { Observable } from 'rxjs';
import {FormsModule} from "@angular/forms";
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements CanComponentDeactivate {
  formDirty: boolean = false;
 @Input({required:false})  profileData: any|unknown;

  canDeactivate(): boolean | Observable<boolean> {
    if (this.formDirty) {
      return confirm('You have unsaved changes. Do you really want to leave?');
    }
    return true;
  }
}

