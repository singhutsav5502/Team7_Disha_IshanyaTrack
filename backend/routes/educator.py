from flask import Blueprint
from controllers.educator import create_new_educator, get_educator_mapping

educator_bp = Blueprint('educator', __name__)

@educator_bp.route('/create_new_educator', methods=['POST'])
def create_new_educator_route():
    return create_new_educator()

@educator_bp.route('/educator_mapping', methods=['GET'])
def get_educator_mapping_route():
    return get_educator_mapping()