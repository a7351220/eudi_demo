import os
import base64
from flask import Flask, request, jsonify
from pymdoccbor.mdoc.issuer import MdocCborIssuer
from cbor2 import CBORTag

app = Flask(__name__)

def serialize_complex_obj(obj):
    if isinstance(obj, dict):
        return {key: serialize_complex_obj(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [serialize_complex_obj(element) for element in obj]
    elif isinstance(obj, CBORTag):
        return serialize_complex_obj(obj.value)
    elif isinstance(obj, bytes):
        return base64.b64encode(obj).decode('utf-8')
    else:
        return obj

@app.route('/api/generate_mdoc', methods=['POST'])
def generate_mdoc():
 
    PID_DATA = request.json

    # 使用預設的PKEY數據
    PKEY = {
        'KTY': 'EC2',
        'CURVE': 'P_256',
        'ALG': 'ES256',
        'D': os.urandom(32),
        'KID': b"demo-kid"
    }

    mdoci = MdocCborIssuer(
        private_key=PKEY
    )

    mdoc = mdoci.new(
        doctype="eu.europa.ec.eudiw.pid.1",
        data=PID_DATA,
        devicekeyinfo=PKEY
    )

    serialized_mdoc = serialize_complex_obj(mdoc)
    return jsonify(serialized_mdoc)

if __name__ == '__main__':
    app.run(debug=True)