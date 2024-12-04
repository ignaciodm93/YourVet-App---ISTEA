import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetsComponent } from './vets.component';

describe('VetsComponent', () => {
  let component: VetsComponent;
  let fixture: ComponentFixture<VetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
