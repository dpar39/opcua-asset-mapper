from __future__ import annotations
import asyncio
from json import JSONEncoder
from typing import List, Set
from asyncua import Client, ua, Node


class AddressSpaceNode:
    def __init__(self, desc, children: List[AddressSpaceNode]):
        self.desc = desc
        self.children = children

    @classmethod
    async def create(
        cls, node: Node, desc: ua.ReferenceDescription, visited: Set[ua.NodeId] = set()
    ) -> AddressSpaceNode:
        visited.add(node.nodeid)
        if desc is None:
            desc = await cls.get_node_desc(node)
        children_descs = await node.get_children_descriptions()
        children_nodes = await node.get_children()

        coroutines = []
        children = []
        if (
            desc.NodeClass != ua.NodeClass.Variable
            and desc.NodeClass != ua.NodeClass.VariableType
            and desc.NodeClass != ua.NodeClass.Unspecified
        ):
            for node1, desc1 in zip(children_nodes, children_descs):
                if node1.nodeid not in visited:
                    coroutines.append(AddressSpaceNode.create(node1, desc1, visited))
            children = await asyncio.gather(*coroutines)

        return AddressSpaceNode(cls.description_to_dict(desc), children=children)

    @classmethod
    async def get_node_desc(cls, node: Node):
        attrs = await node.read_attributes(
            [
                ua.AttributeIds.DisplayName,
                ua.AttributeIds.BrowseName,
                ua.AttributeIds.NodeId,
                ua.AttributeIds.NodeClass,
            ]
        )
        desc = ua.ReferenceDescription()
        desc.DisplayName = attrs[0].Value.Value
        desc.BrowseName = attrs[1].Value.Value
        desc.NodeId = attrs[2].Value.Value
        desc.NodeClass = attrs[3].Value.Value
        desc.TypeDefinition = ua.TwoByteNodeId(ua.ObjectIds.FolderType)
        return desc

    @classmethod
    def description_to_dict(cls, desc: ua.ReferenceDescription):
        return {
            "DisplayName": desc.DisplayName.Text,
            "BrowseName": desc.BrowseName.to_string(),
            "NodeId": desc.NodeId.to_string(),
            "NodeClass": cls.node_class_str(desc.NodeClass, desc.TypeDefinition),
            "NodeTypeId": desc.TypeDefinition.to_string(),
        }

    @classmethod
    def node_class_str(cls, node_class, type_definition):
        if node_class == ua.NodeClass.Object:
            if type_definition == ua.TwoByteNodeId(ua.ObjectIds.FolderType):
                return "Folder"
            else:
                return "Object"
        elif node_class == ua.NodeClass.Variable:
            if type_definition == ua.TwoByteNodeId(ua.ObjectIds.PropertyType):
                return "Property"
            else:
                return "Variable"
        elif node_class == ua.NodeClass.Method:
            return "Method"
        elif node_class == ua.NodeClass.ObjectType:
            return "ObjectType"
        elif node_class == ua.NodeClass.VariableType:
            return "VariableType"
        elif node_class == ua.NodeClass.DataType:
            return "DataType"
        elif node_class == ua.NodeClass.ReferenceType:
            return "ReferenceType"


class OpcUaClient:
    def __init__(self):
        self.client: Client = None

    async def connect(self, url):
        self.client = Client(url)
        await self.client.connect()

    async def disconnect(self):
        await self.client.disconnect()

    async def get_address_space(self) -> AddressSpaceNode:
        try:
            root = self.client.nodes.root
            return await AddressSpaceNode.create(root, None)
        except (ConnectionError, ua.UaError):
            return None


class NodeEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, ua.QualifiedName):
            return f"{o.NamespaceIndex}:{o.Name}"
        if isinstance(o, ua.LocalizedText):
            return o.Text
        if isinstance(o, ua.NodeId):
            return o.to_string()
        try:
            return o.__dict__
        except:
            a = str(o)
            return a


async def main(loop):
    url = "opc.tcp://vm-prosys-plc2.westeurope.cloudapp.azure.com:53530/OPCUA/SimulationServer/"
    client = OpcUaClient()
    await client.connect(url)
    result = await client.get_address_space()
    json_tree = NodeEncoder().encode(result)
    with open("address-space.json", "w") as fp:
        fp.write(json_tree)


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.set_debug(True)
    loop.run_until_complete(main(loop))
    loop.close()
