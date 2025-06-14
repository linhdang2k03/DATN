import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDetailAccountComponent } from './detail-account.component';

describe('AdminDetailAccountComponent', () => {
  let component: AdminDetailAccountComponent;
  let fixture: ComponentFixture<AdminDetailAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDetailAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDetailAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
