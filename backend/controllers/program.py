from flask import request, jsonify
from models.program import insert_program, delete_program, add_educator, add_student
from mysql.connector import IntegrityError

def add_program():
    try:
        data = request.get_json()
        program_name = data.get('Program_Name')

        if not program_name:
            return jsonify({'error': 'Program_Name is required'}), 400

        program_id = insert_program(program_name)

        return jsonify({'message': 'Program added successfully', 'Program_ID': program_id})

    except IntegrityError as e:
        if 'Duplicate entry' in str(e):
            return jsonify({'error': 'Program already exists'}), 409
        return jsonify({'error': 'Database integrity error'}), 500
    except Exception as e:
        print("Error adding program:", e)
        return jsonify({'error': 'Internal server error'}), 500
    
def remove_program(program_id):
    try:
        program = delete_program(program_id)

        if program == -1:
            return jsonify({'error': 'Program not found'}), 404

        return jsonify({'message': 'Program deleted successfully'})

    except Exception as e:
        print("Error removing program:", e)
        return jsonify({'error': 'Internal server error'}), 500
    
def add_educator_to_program(program_id):
    try:
        data = request.get_json()
        educator_id = data.get('educatorId')

        if not educator_id:
            return jsonify({'error': 'Educator ID is required'}), 400

        
        employee_ids = add_educator(program_id, educator_id)
       
        if employee_ids == -1:
            return jsonify({'error': 'Program not found'}), 404

        

        return jsonify({'message': 'Educator added to program', 'Employee_IDs': employee_ids})

    except Exception as e:
        print("Error adding educator to program:", e)
        return jsonify({'error': 'Internal server error'}), 500
    
def add_student_to_program(program_id):
    try:
        data = request.get_json()
        student_id = data.get('studentId')

        if not student_id:
            return jsonify({'error': 'Student ID is required'}), 400

        student_ids = add_student(program_id, student_id)
        if student_ids == -1:
            return jsonify({'error': 'Program not found'}), 404

        return jsonify({'message': 'Student added to program', 'Student_IDs': student_ids})

    except Exception as e:
        print("Error adding student to program:", e)
        return jsonify({'error': 'Internal server error'}), 500