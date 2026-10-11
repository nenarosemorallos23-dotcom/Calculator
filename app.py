from flask import Flask, request, jsonify
from flask_cors import CORS
import math
app = Flask(__name__)
CORS(app)

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    n1 = data.get('num1',0)
    n2 = data.get('num2',0)
    op = data.get('operation','add')
    try:
        if op == 'add': r = n1 + n2
        elif op == 'subtract': r = n1 - n2
        elif op == 'multiply': r = n1 * n2
        elif op == 'divide': r = "Error: Cannot divide by zero" if n2==0 else n1/n2
        elif op == 'modulo': r = n1 % n2
        elif op == 'power': r = n1 ** n2
        elif op == 'square_root': r = math.sqrt(n1)
        else: r = "Invalid"
        return jsonify({'result':r, 'status':'success'})
    except Exception as e:
        return jsonify({'error':str(e)}),400

@app.route('/ping')
def ping(): return jsonify({'status':'Python is running!'})
if __name__ == '__main__': app.run(port=5001, debug=True)