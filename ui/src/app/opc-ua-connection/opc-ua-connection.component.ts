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
  @ViewChild('opcuaServerUrl') opcuaServerUrlElmt: ElementRef;
  connectionStatus: ConnectionStatus;
  constructor(public opcuaService: OpcuaConnectionService) {
    opcuaService.onConnected.subscribe((connectionStatus) =>
      this.updateConnectionStatus(connectionStatus)
    );
  }

  updateConnectionStatus(connectionStatus: ConnectionStatus) {
    this.connectionStatus = connectionStatus;
  }
  connect() {
    let opcuaServerUrl = this.opcuaServerUrlElmt.nativeElement.value;
    this.opcuaService.connect(opcuaServerUrl);
  }
  disconnect() {}
}
