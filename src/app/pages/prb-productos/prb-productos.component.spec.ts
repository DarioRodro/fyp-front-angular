import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrbProductosComponent } from './prb-productos.component';

describe('PrbProductosComponent', () => {
  let component: PrbProductosComponent;
  let fixture: ComponentFixture<PrbProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrbProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrbProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
