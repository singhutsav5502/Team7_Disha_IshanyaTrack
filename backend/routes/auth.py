from flask import Blueprint
from controllers.auth import login, get_user_type

# Login
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods = ['POST'])
def login_route():
    return login

@auth_bp.route('/get-user-type', methods=['POST'])
def get_user_type_route():
    return get_user_type()