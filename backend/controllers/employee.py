from flask import request, jsonify
from models.employee import get_employee_by_id_model, get_all_employees, update_employee

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