from flask import request, jsonify
from models.employee import get_employee_by_id_model, get_all_employees, update_employee, insert_employee, update_employee_role_model
import random, string

def get_employee_by_id():
    data = request.json
    employee_id = data.get('Employee_ID')

    if not employee_id:
        return jsonify({'error': 'Missing Employee ID'}), 400

    try:
        employee = get_employee_by_id_model(employee_id)

        if employee:
            return jsonify(employee)
        else:
            return jsonify({'error': 'Employee not found'}), 404

    except Exception as err:
        return jsonify({'error': str(err)}), 500
    
def get_employees():
    try:
        employees = get_all_employees()
        return jsonify(employees), 200

    except Exception as e:
        print("Error fetching employees:", e)
        return jsonify({'error': 'Failed to fetch employees'}), 500
    
def update_employee_data():
    try:
        data = request.get_json()
        emp_id = data.get('Employee_ID')

        if not emp_id:
            return jsonify({'error': 'Employee ID is required'}), 400

        update_employee(data,emp_id)

        return jsonify({'message': 'Employee profile updated successfully'})

    except Exception as e:
        print("Error updating employee data:", e)
        return jsonify({'error': 'Internal server error'}), 500
    
def create_new_employee():
    try:
        data = request.get_json()

        employee_id = 'E' + ''.join(random.choices(string.digits, k=5))

        insert_employee(employee_id, data)

        return jsonify({
            'success': True,
            'message': 'Employee created successfully',
            'employee_id': employee_id
        }), 201

    except Exception as e:
        print("Error creating employee:", e)
        return jsonify({'error': 'Internal server error'}), 500
    
def update_employee_role():
    try:
        data = request.get_json()
        employee_id = data.get('Employee_ID')
        new_role_type = data.get('Type')

        if not employee_id or new_role_type is None:
            return jsonify({'error': 'Employee ID and Type are required'}), 400

        update_employee_role_model(employee_id, new_role_type)

        return jsonify({
            'message': 'Employee role updated successfully',
            'Employee_ID': employee_id,
            'Type': new_role_type
        }), 200

    except Exception as e:
        print("Error updating employee role:", e)
        return jsonify({'error': 'Internal server error'}), 500