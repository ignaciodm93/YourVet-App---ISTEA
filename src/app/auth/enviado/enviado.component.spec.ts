import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviadoComponent } from './enviado.component';

describe('EnviadoComponent', () => {
  let component: EnviadoComponent;
  let fixture: ComponentFixture<EnviadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnviadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnviadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
