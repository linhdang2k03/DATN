import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAccountUserComponent } from './detail-account.component';

describe('DetailAccountUserComponent', () => {
  let component: DetailAccountUserComponent;
  let fixture: ComponentFixture<DetailAccountUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailAccountUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailAccountUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
