import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerFiguraComponent } from './ver-figura.component';

describe('VerFiguraComponent', () => {
  let component: VerFiguraComponent;
  let fixture: ComponentFixture<VerFiguraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerFiguraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerFiguraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
