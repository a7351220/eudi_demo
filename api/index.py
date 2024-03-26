import os
import base64
from flask import Flask, request, jsonify
from pymdoccbor.mdoc.issuer import MdocCborIssuer
from cbor2 import CBORTag
from flask_cors import CORS
from pymdoccbor.mdoc.verifier import MdocCbor

app = Flask(__name__)
CORS(app)

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
    af_binary_string = mdoci.dumps()
    encoded_string = base64.b64encode(af_binary_string).decode('utf-8')

    return jsonify({"serialized_mdoc": serialized_mdoc, "mdoc_base64": encoded_string})

@app.route('/api/verify_mdoc', methods=['POST'])
def verify_mdoc():
    # 從請求中獲取 issued_mdoc
    issued_mdoc_data = request.json.get('issued_mdoc')
    if not issued_mdoc_data:
        return jsonify({"error": "Missing issued_mdoc data"}), 400



    #創建 MDOC 實例
    mdoc = MdocCbor()
    mdoc.loads(issued_mdoc_data)

    # 驗證 MDOC
    is_valid = mdoc.verify()

    # 返回驗證結果
    if is_valid:
        return jsonify({"message": "MDOC is valid", "is_valid": True})
    else:
        return jsonify({"message": "MDOC is invalid", "is_valid": False})

if __name__ == '__main__':
    app.run()