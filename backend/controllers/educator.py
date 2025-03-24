from models.educator import insert_educator, get_educators_map
from flask import request,jsonify

def create_new_educator():
    try:
        data = request.get_json()

        insert_educator(data)

        response = {
            'success': True,
            'message': 'Educator created successfully',
            'data': {
                'Employee_ID': data.get('Employee_ID'),
                'Educator_Name': data.get('Educator_Name')
            }
        }

        return jsonify(response), 201

    except Exception as e:
        print("Error creating educator:", e)
        return jsonify({'success': False, 'message': f'Failed to create educator: {str(e)}'}), 500
    

def get_educator_mapping():
    try:
        educators = get_educators_map()

        return jsonify(educators), 200

    except Exception as e:
        print("Error fetching educator mapping:", e)
        return jsonify({'error': 'Internal server error'}), 500