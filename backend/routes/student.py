from flask import Blueprint
from controllers.student import get_student_by_id, get_students, update_student_data, create_new_student

student_bp = Blueprint('student', __name__)

@student_bp.route('/get_student_by_id', methods=['POST'])
def get_student_by_id_route():
	return get_student_by_id()

@student_bp.route('/students', methods=['GET'])
def get_students_route():
	return get_students()

@student_bp.route('/update_student_data', methods=['POST'])
def update_student_data_route():
	return update_student_data()

@student_bp.route('/create_new_student', methods=['POST'])
def create_new_student_route():
	return create_new_student()