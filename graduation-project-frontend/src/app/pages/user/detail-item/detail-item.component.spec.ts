import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailItemUserComponent } from './detail-item.component';

describe('DetailItemUserComponent', () => {
  let component: DetailItemUserComponent;
  let fixture: ComponentFixture<DetailItemUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailItemUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailItemUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
