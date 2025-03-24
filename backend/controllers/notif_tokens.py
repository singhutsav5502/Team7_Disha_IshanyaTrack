from flask import request, jsonify
import firebase_admin
from firebase_admin import credentials, messaging

cred = credentials.Certificate("/home/team7/ishanya/serviceAccountKey.json")
firebase_admin.initialize_app(cred)

user_tokens = {}

def save_token():
    student_id = request.form.get('student_id')
    token = request.form.get('token')

    if not student_id or not token:
        return jsonify({'error': 'Missing data'}), 400

    user_tokens[student_id] = token
    return jsonify({'status': 'token saved'})


def notify_user(student_id, user_tokens):
    title = request.json.get('title', 'New Notification')
    body = request.json.get('body', '')

    token = user_tokens.get(student_id)
    if not token:
        return jsonify({'error': 'No token found for this student'}), 404

    message = messaging.Message(
        notification=messaging.Notification(title=title, body=body),
        token=token,
    )

    try:
        response = messaging.send(message)
        return jsonify({'message_id': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500