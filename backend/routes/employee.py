from flask import Blueprint
from controllers.employee import get_employee_by_id, get_employees, update_employee_data, create_new_employee, update_employee_role

employee_bp = Blueprint('employee', __name__)

@employee_bp.route('/get_employee_by_id', methods=['POST'])
def get_employee_by_id_route():
    return get_employee_by_id()

@employee_bp.route('/employees', methods=['GET'])
def get_employees_route():
    return get_employees()

@employee_bp.route('/update_employee_data', methods=['POST'])
def update_employee_data_route():
    return update_employee_data()

@employee_bp.route('/create_new_employee', methods=['POST'])
def create_new_employee_route():
    return create_new_employee()

@employee_bp.route('/update-employee-role', methods=['POST'])
def update_employee_role_route():
    return update_employee_role()