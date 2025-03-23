from flask import Flask, request, jsonify, render_template
import mysql.connector
import os

from models.db_connect import get_db_connection
from routes import auth, student, employee

from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'fallback-secret')


app.register_blueprint(auth.auth_bp)
app.register_blueprint(student.student_bp)
app.register_blueprint(employee.employee_btp)


@app.route('/')
def home():
    return render_template('index.html')

    

@app.route('/get-user-type', methods=['POST'])
def get_user_type():
    try:
        data = request.get_json()
        user_id = data.get('Id')
        password = data.get('pwd')

        if not user_id or not password:
            return jsonify({'error': 'Missing ID or password'}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT type FROM auth WHERE ID = %s AND pwd = %s"
        cursor.execute(query, (user_id, password))
        result = cursor.fetchone()

        cursor.close()
        conn.close()

        if result:
            return jsonify({'type': result['type']}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        print("Error in /get-user-type:", e)
        return jsonify({'error': 'Server error'}), 500
    


    

@app.route('/api/programs', methods=['POST'])
def add_program():
    try:
        data = request.get_json()
        program_name = data.get('Program_Name')

        if not program_name:
            return jsonify({'error': 'Program_Name is required'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert program
        cursor.execute(
            "INSERT INTO Programs (Program_Name, Student_IDs, Employee_IDs) VALUES (%s, %s, %s)",
            (program_name, '[]', '[]')  # default empty JSON arrays
        )

        conn.commit()
        program_id = cursor.lastrowid
        cursor.close()
        conn.close()

        return jsonify({'message': 'Program added successfully', 'Program_ID': program_id})

    except mysql.connector.IntegrityError as e:
        if 'Duplicate entry' in str(e):
            return jsonify({'error': 'Program already exists'}), 409
        return jsonify({'error': 'Database integrity error'}), 500
    except Exception as e:
        print("Error adding program:", e)
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/programs/<int:program_id>', methods=['DELETE'])
def remove_program(program_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # First, check if the program exists
        cursor.execute("SELECT * FROM Programs WHERE Program_ID = %s", (program_id,))
        program = cursor.fetchone()

        if not program:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Program not found'}), 404

        # Perform delete
        cursor.execute("DELETE FROM Programs WHERE Program_ID = %s", (program_id,))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'message': 'Program deleted successfully'})

    except Exception as e:
        print("Error removing program:", e)
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/programs/<int:program_id>/educators', methods=['POST'])
def add_educator_to_program(program_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        data = request.get_json()
        educator_id = data.get('educatorId')

        if not educator_id:
            return jsonify({'error': 'Educator ID is required'}), 400

        # Fetch current Employee_IDs
        cursor.execute("SELECT Employee_IDs FROM Programs WHERE Program_ID = %s", (program_id,))
        result = cursor.fetchone()

        if not result:
            return jsonify({'error': 'Program not found'}), 404

        employee_ids_json = result[0] or '[]'
        employee_ids = json.loads(employee_ids_json)

        # Avoid duplicates
        if educator_id not in employee_ids:
            employee_ids.append(educator_id)

        # Update the JSON column
        cursor.execute(
            "UPDATE Programs SET Employee_IDs = %s WHERE Program_ID = %s",
            (json.dumps(employee_ids), program_id)
        )
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'message': 'Educator added to program', 'Employee_IDs': employee_ids})

    except Exception as e:
        print("Error adding educator to program:", e)
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/api/programs/<int:program_id>/students', methods=['POST'])
def add_student_to_program(program_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        data = request.get_json()
        student_id = data.get('studentId')

        if not student_id:
            return jsonify({'error': 'Student ID is required'}), 400

        # Fetch current Student_IDs
        cursor.execute("SELECT Student_IDs FROM Programs WHERE Program_ID = %s", (program_id,))
        result = cursor.fetchone()

        if not result:
            return jsonify({'error': 'Program not found'}), 404

        student_ids_json = result[0] or '[]'
        student_ids = json.loads(student_ids_json)

        # Avoid duplicates
        if student_id not in student_ids:
            student_ids.append(student_id)

        # Update the JSON column
        cursor.execute(
            "UPDATE Programs SET Student_IDs = %s WHERE Program_ID = %s",
            (json.dumps(student_ids), program_id)
        )
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'message': 'Student added to program', 'Student_IDs': student_ids})

    except Exception as e:
        print("Error adding student to program:", e)
        return jsonify({'error': 'Internal server error'}), 500
