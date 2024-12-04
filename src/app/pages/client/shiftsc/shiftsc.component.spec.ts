import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftscComponent } from './shiftsc.component';

describe('ShiftscComponent', () => {
  let component: ShiftscComponent;
  let fixture: ComponentFixture<ShiftscComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftscComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
