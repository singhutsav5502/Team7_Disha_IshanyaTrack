from flask import Blueprint
from controllers.program import get_programs, add_program, remove_program, add_educator_to_program, add_student_to_program

program_bp = Blueprint('program', __name__)


@program_bp.route('/programs', methods=['GET'])
def get_programs_route():
    return get_programs()

@program_bp.route('/api/programs', methods=['POST'])
def add_program_route():
    return add_program()

@program_bp.route('/api/programs/<int:program_id>', methods=['DELETE'])
def remove_program_route():
    return remove_program()

@program_bp.route('/api/programs/<int:program_id>/educators', methods=['POST'])
def add_educator_to_program_route():
    return add_educator_to_program()

@program_bp.route('/api/programs/<int:program_id>/students', methods=['POST'])
def add_student_to_program_route():
    return add_student_to_program()