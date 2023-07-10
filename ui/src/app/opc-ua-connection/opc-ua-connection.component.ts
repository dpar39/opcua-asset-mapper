import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  OpcuaConnectionService,
  ConnectionStatus,
} from '../services/opcua-connection.service';

@Component({
  selector: 'app-opc-ua-connection',
  templateUrl: './opc-ua-connection.component.html',
  styleUrls: ['./opc-ua-connection.component.scss'],
})
export class OpcUaConnectionComponent {
  public Status = ConnectionStatus;
  public opcuaServerUrl: string;
  connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;

  constructor(public opcuaService: OpcuaConnectionService) {
    opcuaService.onConnected.subscribe((connectionStatus) =>
      this.updateConnectionStatus(connectionStatus)
    );
    this.opcuaServerUrl = opcuaService.getLastOpcuaServerUrl();
  }

  updateConnectionStatus(connectionStatus: ConnectionStatus) {
    this.connectionStatus = connectionStatus;
  }
  connect() {
    this.opcuaService.connect(this.opcuaServerUrl);
  }
  disconnect() {
    this.opcuaService.disconnect();
  }
}
