import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryListAdminComponent } from './category-list.component';

describe('CategoryListComponent', () => {
  let component: CategoryListAdminComponent;
  let fixture: ComponentFixture<CategoryListAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryListAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
