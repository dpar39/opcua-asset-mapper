import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcUaAddressSpaceComponent } from './opc-ua-address-space.component';

describe('OpcUaAddressSpaceComponent', () => {
  let component: OpcUaAddressSpaceComponent;
  let fixture: ComponentFixture<OpcUaAddressSpaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpcUaAddressSpaceComponent]
    });
    fixture = TestBed.createComponent(OpcUaAddressSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
