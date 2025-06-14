import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MustSignComponent } from './must-sign.component';

describe('MustSignComponent', () => {
  let component: MustSignComponent;
  let fixture: ComponentFixture<MustSignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MustSignComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MustSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
