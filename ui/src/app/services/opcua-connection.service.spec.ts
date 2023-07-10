import { TestBed } from '@angular/core/testing';

import { OpcuaConnectionService } from './opcua-connection.service';

describe('OpcuaConnectionService', () => {
  let service: OpcuaConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpcuaConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
