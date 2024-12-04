import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetHistoryComponent } from './pet-history-client.component';

describe('MedicalHistoryComponent', () => {
  let component: PetHistoryComponent;
  let fixture: ComponentFixture<PetHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PetHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
