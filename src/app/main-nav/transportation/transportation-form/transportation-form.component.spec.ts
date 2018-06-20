import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportationFormComponent } from './transportation-form.component';

describe('TransportationFormComponent', () => {
  let component: TransportationFormComponent;
  let fixture: ComponentFixture<TransportationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
