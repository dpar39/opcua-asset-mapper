import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcUaConnectionComponent } from './opc-ua-connection.component';

describe('OpcUaConnectionComponent', () => {
  let component: OpcUaConnectionComponent;
  let fixture: ComponentFixture<OpcUaConnectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpcUaConnectionComponent]
    });
    fixture = TestBed.createComponent(OpcUaConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
