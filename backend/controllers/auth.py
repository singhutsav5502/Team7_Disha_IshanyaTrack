from models.auth import authenticate, get_user_type_model
from flask import jsonify, request

def login():
    try:
        # data from request
        data = request.json # Expecting JSON payload with 'Id' and 'pwd'
        user_id = data.get('Id')
        password = data.get('pwd')

        if not user_id or not password:
            return jsonify({'Authenticated': False, 'Type': None, 'Error': 'Missing credentials'}), 400

        user = authenticate(user_id, password)
        if user:
            return jsonify({'Authenticated': True, 'Type': user['type']})
        else:
            return jsonify({'Authenticated': False, 'Type': None})
        
    except Exception as err:
        print(err)
        return jsonify({'Authenticated': False, 'Type': None, 'Error': str(err)}), 500

def get_user_type():
    try:
        data = request.get_json()
        user_id = data.get('Id')
        password = data.get('pwd')

        if not user_id or not password:
            return jsonify({'error': 'Missing ID or password'}), 400

        result = get_user_type_model(user_id, password)

        if result:
            return jsonify({'type': result['type']}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        print("Error in /get-user-type:", e)
        return jsonify({'error': 'Server error'}), 500