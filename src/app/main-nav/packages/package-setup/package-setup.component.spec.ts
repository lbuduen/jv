import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageSetupComponent } from './package-setup.component';

describe('PackageSetupComponent', () => {
  let component: PackageSetupComponent;
  let fixture: ComponentFixture<PackageSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
