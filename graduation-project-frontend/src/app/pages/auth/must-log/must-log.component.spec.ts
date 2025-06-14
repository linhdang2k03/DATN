import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MustLogComponent } from './must-log.component';

describe('MustLogComponent', () => {
  let component: MustLogComponent;
  let fixture: ComponentFixture<MustLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MustLogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MustLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
