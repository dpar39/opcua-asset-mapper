import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AddressSpaceNode } from '../models/address-space';

import * as $ from 'jquery';
import 'jstree';
import {
  ConnectionStatus,
  OpcuaConnectionService,
} from '../services/opcua-connection.service';

class JsTreeNode {
  id: string;
  text: string;
  icon: string | undefined;
  children: JsTreeNode[];
}

@Component({
  selector: 'app-opc-ua-address-space',
  templateUrl: './opc-ua-address-space.component.html',
  styleUrls: ['./opc-ua-address-space.component.scss'],
})
export class OpcUaAddressSpaceComponent implements OnInit {
  jsTree: any;
  nodeTypes = new Map<string, AddressSpaceNode>();
  private nodeClassIcon = new Map<string, string>(
    Object.entries({
      Folder: 'fa fa-folder text-primary',
      Object: 'fa fa-diagram-project text-info',
      Property: 'fa fa-table-list text-secondary',
      Variable: 'fa fa-chart-line text-error',
      Method: 'fa fa-paper-plane',
      ObjectType: 'fa fa-diagram-project',
      VariableType: 'fa fa-chart-line',
      DataType: 'fa fa-copy',
      ReferenceType: 'fa fa-link',
    })
  );

  constructor(public opcuaService: OpcuaConnectionService) {
    opcuaService.onConnected.subscribe((connectionStatus) => {
      if (connectionStatus == ConnectionStatus.CONNECTED) {
        opcuaService.getAddressSpace().subscribe((tree) => this.populateTree(tree));
      }
    });
  }

  ngOnInit() {
    this.jsTree = $('#address-space-tree');
    // this.http
    //   .get<AddressSpaceNode>('/assets/address-space.json')
    //   .subscribe((tree) => this.populateTree(tree));
  }

  populateTree(tree: AddressSpaceNode) {
    this.nodeTypes.clear();
    this.resolveTypes(tree);
    this.jsTree.jstree({
      core: {
        data: this.makeJsTree(tree),
        themes: {
          variant: 'small',
        },
      },
    });
  }

  makeJsTree(asn: AddressSpaceNode): JsTreeNode {
    const children = [];
    for (let child of asn.children) {
      children.push(this.makeJsTree(child));
    }

    return {
      id: asn.desc.NodeId,
      text: asn.desc.DisplayName,
      icon: this.nodeClassIcon.get(asn.desc.NodeClass),
      children: children,
    };
  }

  resolveTypes(asn: AddressSpaceNode): void {
    if (asn.desc.NodeClass === 'DataType') {
      this.nodeTypes.set(asn.desc.NodeId, asn);
    }
    for (let child of asn.children) {
      this.resolveTypes(child);
    }
  }

  collapseAll() {
    this.jsTree.jstree('close_all');
  }
  expandAll() {
    this.jsTree.jstree('open_all');
  }
}
