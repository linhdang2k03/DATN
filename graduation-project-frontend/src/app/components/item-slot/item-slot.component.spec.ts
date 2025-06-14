import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSlotComponent } from './item-slot.component';

describe('ItemSlotComponent', () => {
  let component: ItemSlotComponent;
  let fixture: ComponentFixture<ItemSlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemSlotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
