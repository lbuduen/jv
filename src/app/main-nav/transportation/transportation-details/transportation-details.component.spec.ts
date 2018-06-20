import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportationDetailsComponent } from './transportation-details.component';

describe('TransportationDetailsComponent', () => {
  let component: TransportationDetailsComponent;
  let fixture: ComponentFixture<TransportationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
