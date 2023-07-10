from quart import Quart, jsonify, request
from quart.json.provider import JSONProvider
import json

from .opcua import OpcUaClient, NodeEncoder


class OpcuaNodeJSONProvider(JSONProvider):
    def dumps(self, obj, **kwargs):
        return json.dumps(obj, **kwargs, cls=NodeEncoder)

    def loads(self, s: str | bytes, **kwargs):
        return json.loads(s, **kwargs)


app = Quart(__name__)
app.json = OpcuaNodeJSONProvider(app)
opcua: OpcUaClient


@app.route("/api/connect")
async def connect():
    global opcua
    url = request.args.get("url")
    opcua = OpcUaClient()
    try:
        await opcua.connect(url)
        return jsonify("CONNECTED")
    except Exception as e:
        return f"unable to connect to OPCUA server: {e}", 400

@app.route("/api/disconnect")
async def disconnect():
    global opcua
    try:
        await opcua.client.disconnect()
    except:
        pass
    return await status()

@app.route("/api/status")
async def status():
    global opcua
    try:
        await opcua.client.check_connection()
        return jsonify("CONNECTED")
    except:
        return jsonify("DISCONNECTED")


@app.route("/api/address-space")
async def get_address_space():
    global opcua
    try:
        asn = await opcua.get_address_space()
        return jsonify(asn)
    except Exception as e:
        return f"Unable to retrieve address space: {e}", 400


app.run()
