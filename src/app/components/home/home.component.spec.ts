import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { User } from '../../Models/User';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;
  let httpTestingController: HttpTestingController;


  function createMockUser(id: string, token: string, expirationTime: number) {
    return {
      id: id,
      email: 'test@example.com',
      _token: token,
      _tokenExpirationDate: new Date(Date.now() + expirationTime).toISOString()
    };
  }

  function getMockUserData(id: string, email: string, token: string, tokenExpirationDate: string) {
    return JSON.stringify({ id, email, _token: token, _tokenExpirationDate: tokenExpirationDate });
  }

  function initializeComponent() {
    const mockUserData = localStorage.getItem('userData');
    if (mockUserData) {
      const parsedUser = JSON.parse(mockUserData);
      component.currentUser = new User(
        parsedUser.email,
        parsedUser.id,
        parsedUser._token,
        new Date(parsedUser._tokenExpirationDate)
      );
      if (component.currentUser && component.currentUser.token) {
        component.fetchTodos();
      }
    }
     
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentUser from localStorage and fetch todos if token is valid', () => {
    const mockUserData = createMockUser('4g6a84g84dfga64','valid-token', 3600 * 1000);

    spyOn(localStorage, 'getItem').and.returnValue(getMockUserData(
      mockUserData.id,
      mockUserData.email,
      mockUserData._token,
      mockUserData._tokenExpirationDate
    ));

    spyOn(component, 'fetchTodos').and.callFake(() => {
      component.todos = [
        { id: 1, title: 'Mock Todo 1', completed: false },
        { id: 2, title: 'Mock Todo 2', completed: true }
      ];
    });

    initializeComponent();

    expect(component.currentUser).toEqual(jasmine.any(User));
    expect(component.currentUser?.email).toBe('test@example.com');
    expect(component.fetchTodos).toHaveBeenCalled();
    expect(component.todos.length).toBe(2);
  });

  it('should navigate to /auth if user is not authenticated', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
  
    // Add a spy for router.navigate before ngOnInit is called
    spyOn(router, 'navigate');
  
  
    // Now manually trigger ngOnInit
    component.ngOnInit();
    fixture.detectChanges();
  
    expect(component.currentUser).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  });

  it('should navigate to /auth if token is expired', () => {
    const mockUserData = createMockUser('4g6a84g84dfga64','expired-token', -3600 * 1000);

    spyOn(localStorage, 'getItem').and.returnValue(getMockUserData(
      mockUserData.id,
      mockUserData.email,
      mockUserData._token,
      mockUserData._tokenExpirationDate
    ));

    // Add a spy for router.navigate before ngOnInit is called
    spyOn(router, 'navigate');

    // Now manually trigger ngOnInit
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.currentUser).toEqual(jasmine.any(User));
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  });


  it('should fetch todos successfully', () => {
    const mockUserData = createMockUser('4g6a84g84dfga64','valid-token', 3600 * 1000);
    spyOn(localStorage, 'getItem').and.returnValue(getMockUserData(
      mockUserData.id,
      mockUserData.email,
      mockUserData._token,
      mockUserData._tokenExpirationDate
    ));
  
    initializeComponent();
  
    const mockTodos = [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: true }
    ];
  
    const req = httpTestingController.expectOne('https://my-json-server.typicode.com/stankobelan/demo/todos');
    expect(req.request.method).toEqual('GET');
    req.flush(mockTodos);
  
    expect(component.todos.length).toBe(2);
    expect(component.todos).toEqual(mockTodos);
  });

  it('should handle error when fetching todos', () => {
    const mockUserData = createMockUser('4g6a84g84dfga64','valid-token', 3600 * 1000);
    spyOn(localStorage, 'getItem').and.returnValue(getMockUserData(
      mockUserData.id,
      mockUserData.email,
      mockUserData._token,
      mockUserData._tokenExpirationDate
    ));
    
    // Add spy for router.navigate before triggering the error
    spyOn(router, 'navigate');
  
    initializeComponent();
    
    const req = httpTestingController.expectOne('https://my-json-server.typicode.com/stankobelan/demo/todos');
    expect(req.request.method).toEqual('GET');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });
    
    expect(component.todos.length).toBe(0);
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  });
  
  it('should navigate to edit page when editTodo is called', () => {
    spyOn(router, 'navigate');
    component.editTodo(1);
    expect(router.navigate).toHaveBeenCalledWith(['/tasks/edit', 1]);
  });
});
