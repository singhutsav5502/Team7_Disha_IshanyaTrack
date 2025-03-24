from models.student import get_student_id, get_all_students, update_student
from flask import jsonify, request

def get_student_by_id():
    try:
        data = request.json
        student_id = data.get('S_ID')

        if not student_id:
            return jsonify({'error': 'Missing student ID'}), 400

        student = get_student_id(student_id)

        if student:
            return jsonify(student)
        else:
            return jsonify({'error': 'Student not found'}), 404

    except Exception as err:
        return jsonify({'error': str(err)}), 500
    
def get_students():
    try:
        result = get_all_students()
        return jsonify(result), 200

    except Exception as err:
        print(err)
        return jsonify({'error': 'Server error'}), 500
    
def update_student_data():
    try:
        data = request.get_json()
        student_id = data.get('S_ID')

        if not student_id:
            return jsonify({'error': 'Student ID is required'}), 400

        update_student(data, student_id)

        return jsonify({'message': 'Student profile updated successfully'})

    except Exception as e:
        print("Error updating student data:", e)
        return jsonify({'error': 'Internal server error'}), 500
        