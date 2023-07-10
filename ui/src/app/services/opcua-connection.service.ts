import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { AddressSpaceNode } from '../models/address-space';
import { Observable } from 'rxjs';

export enum ConnectionStatus {
  CONNECTED,
  CONNECTING,
  DISCONNECTED,
  DISCONNECTING
}

@Injectable({
  providedIn: 'root',
})
export class OpcuaConnectionService {
  constructor(private http: HttpClient) {}

  public onConnected = new EventEmitter<ConnectionStatus>();

  connect(url?: string) {
    if (!url) {
      url = this.getLastOpcuaServerUrl();
    }

    const params = new HttpParams();
    params.append('url', url);
    this.http.get('/api/connect', { params: params }).subscribe((res) => {
      // TODO: save in localStorage
      this.onConnected.emit(ConnectionStatus.CONNECTED);
    });
  }

  getLastOpcuaServerUrl() {
    // TODO: load from localStorage
    return 'opc.tcp://vm-prosys-plc2.westeurope.cloudapp.azure.com:53530/OPCUA/SimulationServer/';
  }

  getAddessSpace(): Observable<AddressSpaceNode> {
    return this.http.get<AddressSpaceNode>('/api/address-space');
  }
}
