from __future__ import annotations
import asyncio
from json import JSONEncoder
from asyncua import Client, ua, Node


def nodeClassToString(node_class, type_definition):
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


def descriptionToDict(desc: ua.ReferenceDescription):
    return {
        "DisplayName": desc.DisplayName.Text,
        "BrowseName": desc.BrowseName.to_string(),
        "NodeId": desc.NodeId.to_string(),
        "NodeClass": nodeClassToString(desc.NodeClass, desc.TypeDefinition),
        "NodeTypeId": desc.TypeDefinition.to_string(),
    }


class TreeNode:
    def __init__(self, desc, children):
        self.desc = desc
        self.children = children

    @staticmethod
    async def create(node: Node, desc=None, visited=set()) -> TreeNode:
        visited.add(node.nodeid)
        children_descs = await node.get_children_descriptions()
        children_nodes = await node.get_children()

        coroutines = []
        for node1, desc1 in zip(children_nodes, children_descs):
            if node1.nodeid not in visited:
                coroutines.append(TreeNode.create(node1, desc1, visited))
        children = await asyncio.gather(*coroutines)

        if desc == None:
            desc = await TreeNode.get_node_desc(node)
        return TreeNode(descriptionToDict(desc), children=children)

    @staticmethod
    async def get_node_desc(node: Node):
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


async def main():
    async with Client(
        url="opc.tcp://vm-prosys-plc2.westeurope.cloudapp.azure.com:53530/OPCUA/SimulationServer/"
    ) as client:
        while True:
            node = client.get_node("ns=10;i=6020")
            value = await node.read_value()
            print(f"ActualPosition={value}")
            await asyncio.sleep(1)



async def get_address_space_tree(url):
    client = Client(url)

    tree = None

    try:
        async with client:
            root = client.nodes.root
            tree = await TreeNode.create(root)
            nodeTypes = resolveTypes(tree)
            json_tree = NodeEncoder().encode(tree)
            print(tree)
    except (ConnectionError, ua.UaError):
        pass

def resolveTypes(node: TreeNode, nodeTypes = {}):
    if node.desc['NodeClass'] == 'DataType':
        nodeTypes[node.desc['NodeId']] = node.desc['DisplayName']
    for n in node.children:
        resolveTypes(n, nodeTypes)
    return nodeTypes

if __name__ == "__main__":
    url = "opc.tcp://vm-prosys-plc2.westeurope.cloudapp.azure.com:53530/OPCUA/SimulationServer/"
    asyncio.run(get_address_space_tree(url))
