from flask import Blueprint
from controllers.notif_tokens import save_token, notify_user

notif_bp = Blueprint('notif_token', __name__)

@notif_bp.route('/save-token', methods=['POST'])
def save_token_route():
    return save_token()

@notif_bp.route('/notify/<student_id>', methods=['POST'])
def notify_user_route():
    return notify_user()