from flask import Blueprint
from controllers.employee import get_employee_by_id, get_employees, update_employee_data

employee_btp = Blueprint('employee', __name__)

@employee_btp.route('/get_employee_by_id', methods=['POST'])
def get_employee_by_id_route():
    return get_employee_by_id()

@employee_btp.route('/employees', methods=['GET'])
def get_employees_route():
    return get_employees()

@employee_btp.route('/update_employee_data', methods=['POST'])
def update_employee_data_route():
    return update_employee_data()