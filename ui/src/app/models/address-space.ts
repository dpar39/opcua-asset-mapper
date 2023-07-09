export class AddressSpaceInfo {
  public DisplayName: string;
  public BrowseName: string;
  public NodeId: string;
  public NodeClass: string;
  public NodeTypeId: string;
}
export class AddressSpaceNode {
  public desc: AddressSpaceInfo;
  public children: AddressSpaceNode[];
}
