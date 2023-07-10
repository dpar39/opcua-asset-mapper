import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { AddressSpaceNode } from '../models/address-space';
import { Observable } from 'rxjs';

export enum ConnectionStatus {
  CONNECTED = 'CONNECTED',
  CONNECTING = 'CONNECTING',
  DISCONNECTED = 'DISCONNECTED',
  DISCONNECTING = 'DISCONNECTING',
}

@Injectable({
  providedIn: 'root',
})
export class OpcuaConnectionService {
  constructor(private http: HttpClient) {}

  public onConnected = new EventEmitter<ConnectionStatus>();

  emitStatus(statusStr: string) {
    const status: ConnectionStatus = statusStr as ConnectionStatus;
    this.onConnected.emit(status);
  }

  connect(url?: string) {
    if (!url) {
      url = this.getLastOpcuaServerUrl();
    }
    this.emitStatus(ConnectionStatus.CONNECTING);
    this.http.get('/api/connect', { params: { url: url } }).subscribe({
      next: (res) => {
        // TODO: save in localStorage
        this.emitStatus(res as string);
      },
      error: (err) => {
        console.error(err);
        this.emitStatus(ConnectionStatus.DISCONNECTED);
      },
    });
  }

  disconnect() {
    this.emitStatus(ConnectionStatus.DISCONNECTING);
    this.http.get('/api/disconnect').subscribe({
      next: (res) => {
        this.emitStatus(res as string);
      },
      error: (err) => {
        console.error(err);
        this.emitStatus(ConnectionStatus.DISCONNECTED);
      },
    });
  }

  getLastOpcuaServerUrl() {
    // TODO: load from localStorage
    return 'opc.tcp://vm-prosys-plc2.westeurope.cloudapp.azure.com:53530/OPCUA/SimulationServer/';
  }

  getAddressSpace(): Observable<AddressSpaceNode> {
    return this.http.get<AddressSpaceNode>('/api/address-space');
  }
}
