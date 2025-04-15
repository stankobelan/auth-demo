import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileComponent } from './edit-profile.component';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

fdescribe('EditProfileComponent', () => {
  let component: EditProfileComponent; // Component instance
  let fixture: ComponentFixture<EditProfileComponent>; // Test fixture for the component
  let debugElement: DebugElement; // DebugElement for querying DOM elements

  // Runs before each test to set up the testing module
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EditProfileComponent], // Import necessary modules
    }).compileComponents(); // Compile the component and its template
  });

  // Runs before each test to initialize the component and set up the test environment
  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileComponent); // Create the component instance
    component = fixture.componentInstance; // Get the component instance
    debugElement = fixture.debugElement; // Get the DebugElement for DOM queries

    // Set initial profile data for the component
    component.profileData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
    };

    fixture.detectChanges(); // Trigger change detection to update the view
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test to verify that the form renders with the correct initial values
  it('should render form with initial values', () => {
    const nameInput = debugElement.query(By.css('input#name')).nativeElement; // Query the name input element
    const emailInput = debugElement.query(By.css('input#email')).nativeElement; // Query the email input element
    const roleInput = debugElement.query(By.css('input#role')).nativeElement; // Query the role input element

    // Assert that the input values match the initial profile data
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john.doe@example.com');
    expect(roleInput.value).toBe('Admin');
    expect(roleInput.disabled).toBeTrue(); // Assert that the role input is disabled
  });

  // Test to check if formDirty is set to true when input values are changed
  it('should set formDirty to true when input values are changed', () => {
    const nameInput = debugElement.query(By.css('input#name')).nativeElement; // Query the name input element
    nameInput.value = 'Jane Doe'; // Change the input value
    nameInput.dispatchEvent(new Event('input')); // Dispatch an input event to simulate user interaction

    // Simulate marking the form as dirty
    component.formDirty = true;
    fixture.detectChanges(); // Trigger change detection

    expect(component.formDirty).toBeTrue(); // Assert that formDirty is true
  });

  // Test to check if formDirty is set to false when the save button is clicked
  it('should set formDirty to false when save button is clicked', () => {
    component.formDirty = true; // Set formDirty to true initially
    fixture.detectChanges(); // Trigger change detection

    const saveButton = debugElement.query(By.css('button')).nativeElement; // Query the save button
    saveButton.click(); // Simulate a button click
    fixture.detectChanges(); // Trigger change detection

    expect(component.formDirty).toBeFalse(); // Assert that formDirty is false
  });

  // Test to confirm navigation when there are unsaved changes
  it('should confirm navigation if there are unsaved changes', () => {
    spyOn(window, 'confirm').and.returnValue(true); // Spy on the window.confirm method and return true
    component.formDirty = true; // Set formDirty to true
    fixture.detectChanges(); // Trigger change detection

    const result = component.canDeactivate(); // Call the canDeactivate method
    expect(window.confirm).toHaveBeenCalledWith(
      'You have unsaved changes. Do you really want to leave?'
    ); // Assert that the confirm dialog is shown
    expect(result).toBeTrue(); // Assert that navigation is allowed
  });

  it('should allow navigation if there are no unsaved changes', () => {
    component.formDirty = false; // Set formDirty to false
    const result = component.canDeactivate(); // Call the canDeactivate method
    expect(result).toBeTrue(); // Assert that navigation is allowed
  });
});
