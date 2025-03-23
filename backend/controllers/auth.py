from models.auth import authenticate
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
