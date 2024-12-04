import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetProfileComponent } from './vet-profile.component';

describe('VetProfileComponent', () => {
  let component: VetProfileComponent;
  let fixture: ComponentFixture<VetProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VetProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VetProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
