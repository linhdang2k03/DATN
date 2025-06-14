import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryListUserComponent } from './category-list.component';

describe('CategoryListComponent', () => {
  let component: CategoryListUserComponent;
  let fixture: ComponentFixture<CategoryListUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryListUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryListUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
