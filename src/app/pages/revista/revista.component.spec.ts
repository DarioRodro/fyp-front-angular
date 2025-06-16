import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevistaComponent } from './revista.component';

describe('RevistaComponent', () => {
  let component: RevistaComponent;
  let fixture: ComponentFixture<RevistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
