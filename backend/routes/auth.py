from flask import Blueprint
from controllers.auth import login

# Login
auth_bp = Blueprint('auth', __name__)
@auth_bp.route('/login', methods = ['POST'])
def login_route():
    return login