# from flask import Flask, render_template
# from flask_cors import CORS
# import os
# from dotenv import load_dotenv
# load_dotenv()

# from routes import auth, student, employee


# app = Flask(__name__)
# app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'fallback-secret')
# CORS(app, resources={r"/*": {"origins": "*"}})


# app.register_blueprint(auth.auth_bp)
# app.register_blueprint(student.student_bp)
# app.register_blueprint(employee.employee_btp)


# @app.route('/')
# def home():
#     return render_template('index.html')

# if __name__ == "__main__":
#     app.run(host='0.0.0.0', debug=True, port = 7000, use_reloader=False)


from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import mysql.connector
import json
import random
import string
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, messaging
from report2 import  get_student_performance_by_quarter
from flask_mail import Mail, Message
import os

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'c926768d46485785979f3ea0ebcfce929923fa7ad058c712d1fc2eb37e07cfe5'
app.config['MAIL_SERVER'] = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('SMTP_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('SMTP_USERNAME', 'team7msishanya@gmail.com')
app.config['MAIL_PASSWORD'] = os.environ.get('SMTP_PASSWORD', 'rjzobahfvyxdtoye')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('SENDER_EMAIL', 'team7msishanya@gmail.com')
mail = Mail(app)
CORS(app, resources={r"/*": {"origins": "*"}})

# Database Configuration
db_config = {
    'host': 'team7.mysql.pythonanywhere-services.com',
    'user': 'team7',
    'password': 'ishanyateam7',
    'database': 'team7$Ishanya'
}

cred = credentials.Certificate("/home/team7/ishanya/serviceAccountKey.json")
firebase_admin.initialize_app(cred)

def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response, 200

@app.errorhandler(500)
def handle_500_error(e):
    return jsonify({
        "error": "Internal server error",
        "message": str(e)
    }), 500

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.json  # Expecting JSON payload with 'Id' and 'pwd'
    user_id = data.get('Id')
    password = data.get('pwd')

    if not user_id or not password:
        return jsonify({'Authenticated': False, 'Type': None, 'Error': 'Missing credentials'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT * FROM auth WHERE ID = %s AND pwd = %s"
        cursor.execute(query, (user_id, password))
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if user:
            return jsonify({'Authenticated': True, 'Type': user['type']})
        else:
            return jsonify({'Authenticated': False, 'Type': None})

    except mysql.connector.Error as err:
        return jsonify({'Authenticated': False, 'Type': None, 'Error': str(err)}), 500

@app.route('/get_student_by_id', methods=['POST'])
def get_student_by_id():
    data = request.json
    student_id = data.get('S_ID')

    if not student_id:
        return jsonify({'error': 'Missing student ID'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT * FROM Student WHERE S_ID = %s"
        cursor.execute(query, (student_id,))
        student = cursor.fetchone()

        cursor.close()
        conn.close()

        if student:
            # Handle the BLOB data - either convert to base64 or exclude it
            if 'Photo' in student and student['Photo'] is not None:
                # Option 1: Remove the Photo field
                student.pop('Photo', None)

                # Option 2 (alternative): Convert to base64
                # import base64
                # student['Photo'] = base64.b64encode(student['Photo']).decode('utf-8')

            return jsonify(student)
        else:
            return jsonify({'error': 'Student not found'}), 404

    except Exception as err:
        return jsonify({'error': str(err)}), 500


@app.route('/get_employee_by_id', methods=['POST'])
def get_employee_by_id():
    data = request.json
    employee_id = data.get('Employee_ID')

    if not employee_id:
        return jsonify({'error': 'Missing Employee ID'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT * FROM Employees WHERE Employee_ID = %s"
        cursor.execute(query, (employee_id,))
        employee = cursor.fetchone()

        cursor.close()
        conn.close()

        if employee:
            return jsonify(employee)
        else:
            return jsonify({'error': 'Employee not found'}), 404

    except Exception as err:
        return jsonify({'error': str(err)}), 500

@app.route('/get-user-type', methods=['POST'])
def get_user_type():
    try:
        data = request.get_json()
        user_id = data.get('Id')

        if not user_id:
            return jsonify({'error': 'Missing ID'}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT type FROM auth WHERE ID = %s"
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()

        cursor.close()
        conn.close()

        if result:
            return jsonify({'type': result['type']}), 200
        else:
            return jsonify({'error': 'User ID not found'}), 404

    except Exception as e:
        print("Error in /get-user-type:", e)
        return jsonify({'error': 'Server error'}), 500


@app.route('/employees', methods=['GET'])
def get_employees():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT
              Employee_ID, Name, Gender, Designation, Department, Employment_Type,
              Email, Phone, Date_of_Birth, Date_of_Joining, Date_of_Leaving,
              Status, Tenure, Work_Location, Emergency_Contact_Name,
              Emergency_Contact_Number, Blood_Group
            FROM Employees;
        """
        cursor.execute(query)
        employees = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(employees)

    except Exception as e:
        print("Error fetching employees:", e)
        return jsonify({'error': 'Failed to fetch employees'}), 500


@app.route('/students', methods=['GET'])
def get_students():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT
                S_ID, Fname, Lname, Gender, DOB, Primary_Diagnosis,
                Comorbidity, UDID, Enrollment_Year, Status, Email,
                Sessions, Timings, Days_of_Week,
                Primary_E_ID, Secondary_E_ID, Session_Type, Father, Mother,
                Blood_Grp, Allergies, Contact_No, Alt_Contact_No, Parent_Email
            FROM Student
        """
        cursor.execute(query)
        result = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(result), 200
    except Exception as e:
        print("Error in /students:", e)
        return jsonify({'error': 'Server error'}), 500

@app.route('/update_student_data', methods=['POST'])
def update_student_data():
    try:
        data = request.get_json()
        student_id = data.get('S_ID')

        if not student_id:
            return jsonify({'error': 'Student ID is required'}), 400

        update_fields = [
            'Fname', 'Lname', 'Gender', 'DOB', 'Primary_Diagnosis',
            'Comorbidity', 'UDID', 'Enrollment_Year', 'Status', 'Email',
            'Sessions', 'Timings', 'Days_of_Week',
            'Primary_E_ID', 'Secondary_E_ID', 'Session_Type', 'Father',
            'Mother', 'Blood_Grp', 'Allergies', 'Contact_No', 'Alt_Contact_No',
            'Parent_Email'
        ]

        set_clause = ', '.join([f"{field} = %s" for field in update_fields])
        values = [data.get(field) for field in update_fields]

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            f"UPDATE Student SET {set_clause} WHERE S_ID = %s",
            values + [student_id]
        )
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Student profile updated successfully'})

    except Exception as e:
        print("Error updating student data:", e)
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/update_employee_data', methods=['POST'])
def update_employee_data():
    try:
        data = request.get_json()
        emp_id = data.get('Employee_ID')

        if not emp_id:
            return jsonify({'error': 'Employee ID is required'}), 400

        update_fields = [
            'Name', 'Gender', 'Designation', 'Department',
            'Employment_Type', 'Email', 'Phone', 'Date_of_Birth',
            'Date_of_Joining', 'Date_of_Leaving', 'Status', 'Tenure',
            'Work_Location', 'Emergency_Contact_Name',
            'Emergency_Contact_Number', 'Blood_Group'
        ]

        set_clause = ', '.join([f"{field} = %s" for field in update_fields])
        values = [data.get(field) for field in update_fields]

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            f"UPDATE Employees SET {set_clause} WHERE Employee_ID = %s",
            values + [emp_id]
        )
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Employee profile updated successfully'})

    except Exception as e:
        print("Error updating employee data:", e)
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/educator_mapping', methods=['GET'])
def get_educator_mapping():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT Employee_ID, Educator_Name FROM Educator"
        cursor.execute(query)
        educators = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(educators), 200

    except Exception as e:
        print("Error fetching educator mapping:", e)
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/programs', methods=['GET'])
def get_programs():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT Program_ID, Program_Name FROM Programs"
        cursor.execute(query)
        programs = cursor.fetchall()

        for program in programs:
            program_id = program['Program_ID']

            cursor.execute(
                "SELECT Student_ID FROM Program_Students WHERE Program_ID = %s",
                (program_id,)
            )
            student_results = cursor.fetchall()
            program['Student_IDs'] = [result['Student_ID'] for result in student_results]

            cursor.execute(
                "SELECT Employee_ID FROM Program_Employees WHERE Program_ID = %s",
                (program_id,)
            )
            employee_results = cursor.fetchall()
            program['Employee_IDs'] = [result['Employee_ID'] for result in employee_results]

        cursor.close()
        conn.close()

        return jsonify(programs), 200

    except Exception as e:
        print("Error fetching programs:", e)
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/api/programs', methods=['POST'])
def add_program():
    try:
        data = request.get_json()
        program_name = data.get('Program_Name')

        if not program_name:
            return jsonify({'error': 'Please set program name.'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert program - only Program_ID and Program_Name fields
        cursor.execute(
            "INSERT INTO Programs (Program_Name) VALUES (%s)",
            (program_name,)
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

        # Delete related entries in junction tables first
        cursor.execute("DELETE FROM Program_Students WHERE Program_ID = %s", (program_id,))
        cursor.execute("DELETE FROM Program_Employees WHERE Program_ID = %s", (program_id,))

        # Then delete the program
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

        # Check if program exists
        cursor.execute("SELECT * FROM Programs WHERE Program_ID = %s", (program_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'Program not found'}), 404

        # Check if educator exists
        cursor.execute("SELECT * FROM Employees WHERE Employee_ID = %s", (educator_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'Educator not found'}), 404

        # Check if relationship already exists
        cursor.execute(
            "SELECT * FROM Program_Employees WHERE Program_ID = %s AND Employee_ID = %s",
            (program_id, educator_id)
        )
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'message': 'Educator already in program'}), 200

        # Add educator to program through junction table
        cursor.execute(
            "INSERT INTO Program_Employees (Program_ID, Employee_ID) VALUES (%s, %s)",
            (program_id, educator_id)
        )
        conn.commit()

        # Get all educators for this program
        cursor.execute(
            "SELECT Employee_ID FROM Program_Employees WHERE Program_ID = %s",
            (program_id,)
        )
        educators = [row[0] for row in cursor.fetchall()]

        cursor.close()
        conn.close()

        return jsonify({'message': 'Educator added to program', 'Employee_IDs': educators})

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

        # Check if program exists
        cursor.execute("SELECT * FROM Programs WHERE Program_ID = %s", (program_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'Program not found'}), 404

        # Check if student exists
        cursor.execute("SELECT * FROM Student WHERE S_ID = %s", (student_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'Student not found'}), 404

        # Check if relationship already exists
        cursor.execute(
            "SELECT * FROM Program_Students WHERE Program_ID = %s AND Student_ID = %s",
            (program_id, student_id)
        )
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'message': 'Student already in program'}), 200

        # Add student to program through junction table
        cursor.execute(
            "INSERT INTO Program_Students (Program_ID, Student_ID) VALUES (%s, %s)",
            (program_id, student_id)
        )
        conn.commit()

        # Get all students for this program
        cursor.execute(
            "SELECT Student_ID FROM Program_Students WHERE Program_ID = %s",
            (program_id,)
        )
        students = [row[0] for row in cursor.fetchall()]

        cursor.close()
        conn.close()

        return jsonify({'message': 'Student added to program', 'Student_IDs': students})

    except Exception as e:
        print("Error adding student to program:", e)
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/create_new_educator', methods=['POST'])
def create_new_educator():
    try:
        data = request.get_json()

        program_id = data.get('Program_ID')

        educator_data = {k: v for k, v in data.items() if k != 'Program_ID'}

        conn = get_db_connection()
        cursor = conn.cursor()

        fields = ', '.join(educator_data.keys())
        placeholders = ', '.join(['%s'] * len(educator_data))
        values = list(educator_data.values())

        query = f"INSERT INTO Educator ({fields}) VALUES ({placeholders})"
        cursor.execute(query, values)

        if program_id:
            employee_id = data.get('Employee_ID')
            cursor.execute(
                "INSERT INTO Program_Employees (Employee_ID, Program_ID) VALUES (%s, %s)",
                (employee_id, program_id)
            )

        conn.commit()

        response = {
            'success': True,
            'message': 'Educator created successfully',
            'data': {
                'Employee_ID': data.get('Employee_ID'),
                'Educator_Name': data.get('Educator_Name')
            }
        }

        cursor.close()
        conn.close()

        return jsonify(response), 201

    except mysql.connector.IntegrityError as e:
        error_message = str(e)
        if 'Duplicate entry' in error_message:
            if 'PRIMARY' in error_message:
                return jsonify({'success': False, 'message': 'An educator with this Employee ID already exists'}), 409
            else:
                return jsonify({'success': False, 'message': 'Database integrity error'}), 409
        return jsonify({'success': False, 'message': 'Database integrity error'}), 500

    except Exception as e:
        print("Error creating educator:", e)
        return jsonify({'success': False, 'message': f'Failed to create educator: {str(e)}'}), 500

def generate_password(length=10):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for _ in range(length))



@app.route('/create_new_employee', methods=['POST'])
def create_new_employee():
    try:
        data = request.get_json()
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT MAX(CAST(SUBSTRING(Employee_ID, 2) AS UNSIGNED)) FROM Employees")
        result = cursor.fetchone()
        last_id = result[0] if result[0] else 0
        employee_id = f'E{last_id + 1}'

        password = generate_password()
        employee_data = {'Employee_ID': employee_id, **data}

        fields = ', '.join(employee_data.keys())
        placeholders = ', '.join(['%s'] * len(employee_data))
        values = tuple(employee_data.values())

        query = f"INSERT INTO Employees ({fields}) VALUES ({placeholders})"
        cursor.execute(query, values)

        cursor.execute("INSERT INTO auth (ID, pwd, type) VALUES (%s, %s, %s)", (employee_id, password, 1))

        conn.commit()
        cursor.close()
        conn.close()

        email_body = f"Hello {data['Name']},\n\nYour account has been created.\nYour Employee ID: {employee_id}\nYour Password: {password}\n\nPlease change your password after logging in."
        send_email(data['Email'], "Your New Employee Account", email_body)

        return jsonify({'success': True, 'message': 'Employee created successfully', 'employee_id': employee_id}), 201

    except mysql.connector.IntegrityError as e:
        error_message = str(e)
        if 'Duplicate entry' in error_message:
            if 'Email' in error_message:
                return jsonify({'success': False, 'message': 'An employee with this email already exists. Please use a different email address.'}), 409
            else:
                return jsonify({'success': False, 'message': 'Database integrity error: ' + error_message}), 409
        return jsonify({'success': False, 'message': 'Database integrity error: ' + error_message}), 500
    except mysql.connector.Error as e:
        return jsonify({'success': False, 'message': f'Database error: {str(e)}'}), 500
    except Exception as e:
        print("Error creating employee:", e)
        return jsonify({'success': False, 'message': f'Failed to create employee: {str(e)}'}), 500
        
        
@app.route('/create_new_student', methods=['POST'])
def create_new_student():
    try:
        data = request.get_json()
        parent_email = data.get('Parent_Email')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if email already exists
        cursor.execute("SELECT * FROM Student WHERE Parent_Email = %s", (parent_email,))
        existing_student = cursor.fetchone()
        
        if existing_student:
            cursor.close()
            conn.close()
            return jsonify({
                'success': False, 
                'message': 'A student with this parent email already exists. Please use a different email address.'
            }), 409
        
        # Continue with student creation if email is unique
        cursor.execute("SELECT MAX(CAST(SUBSTRING(S_ID, 2) AS UNSIGNED)) FROM Student")
        result = cursor.fetchone()
        last_id = result[0] if result[0] else 0
        student_id = f'S{last_id + 1}'

        password = generate_password()
        student_data = {'S_ID': student_id, **data}

        fields = ', '.join(student_data.keys())
        placeholders = ', '.join(['%s'] * len(student_data))
        values = tuple(student_data.values())

        query = f"INSERT INTO Student ({fields}) VALUES ({placeholders})"
        cursor.execute(query, values)

        cursor.execute("INSERT INTO auth (ID, pwd, type) VALUES (%s, %s, %s)", (student_id, password, 0))

        conn.commit()
        cursor.close()
        conn.close()

        email_body = f"Hello Parent,\n\nYour child's student account has been created.\nStudent ID: {student_id}\nPassword: {password}\n\nPlease ensure your child changes the password after logging in."
        send_email(data['Parent_Email'], "Your Child's Student Account Details", email_body)

        return jsonify({'success': True, 'message': 'Student created successfully', 'student_id': student_id}), 201

    except mysql.connector.IntegrityError as e:
        error_message = str(e)
        if 'Duplicate entry' in error_message:
            if 'Parent_Email' in error_message:
                return jsonify({'success': False, 'message': 'A student with this parent email already exists. Please use a different email address.'}), 409
            else:
                return jsonify({'success': False, 'message': 'Database integrity error: ' + error_message}), 409
        return jsonify({'success': False, 'message': 'Database integrity error: ' + error_message}), 500
    except mysql.connector.Error as e:
        return jsonify({'success': False, 'message': f'Database error: {str(e)}'}), 500
    except Exception as e:
        print("Error creating student:", e)
        return jsonify({'success': False, 'message': f'Failed to create student: {str(e)}'}), 500

@app.route('/update-employee-role', methods=['POST'])
def update_employee_role():
    try:
        data = request.get_json()
        employee_id = data.get('Employee_ID')
        new_role_type = data.get('Type')

        if not employee_id or new_role_type is None:
            return jsonify({'error': 'Employee ID and Type are required'}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Update the auth table
        cursor.execute(
            "UPDATE auth SET type = %s WHERE ID = %s",
            (new_role_type, employee_id)
        )

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            'message': 'Employee role updated successfully',
            'Employee_ID': employee_id,
            'Type': new_role_type
        }), 200

    except Exception as e:
        print("Error updating employee role:", e)
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/save-token', methods=['POST'])
def save_token():
    """Saves or updates a user's FCM token."""
    student_id = request.form.get('student_id')
    token = request.form.get('token')

    if not student_id or not token:
        return jsonify({'error': 'Missing data'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert if not exists, otherwise update
        cursor.execute(
            "INSERT INTO UserTokens (Student_ID, Token) VALUES (%s, %s) "
            "ON DUPLICATE KEY UPDATE Token = VALUES(Token)",
            (student_id, token)
        )

        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'status': 'Token saved successfully'})
    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {e}'}), 500

@app.route('/notify/<student_id>', methods=['POST'])
def notify_user(student_id):
    """Sends a push notification to a specific student."""
    title = request.json.get('title', 'New Notification')
    body = request.json.get('body', '')

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert notification into database
        cursor.execute(
            "INSERT INTO Notifications (Title, Body, Student_ID, Date_Time) VALUES (%s, %s, %s, NOW())",
            (title, body, student_id)
        )
        conn.commit()

        # Fetch user token from database
        cursor.execute("SELECT Token FROM UserTokens WHERE Student_ID = %s", (student_id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()

        if not result:
            return jsonify({'error': 'No token found for this student'}), 404

        token = result[0]

        # Send FCM notification
        message = messaging.Message(
            notification=messaging.Notification(title=title, body=body),
            token=token,
        )

        response = messaging.send(message)
        return jsonify({'message_id': response})
    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {e}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get-notifications/<student_id>', methods=['GET'])
def get_notifications(student_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT Title, Body, Date_Time
        FROM Notifications
        WHERE Student_ID = %s
        ORDER BY Date_Time DESC
        """
        cursor.execute(query, (student_id,))
        notifications = cursor.fetchall()

        cursor.close()
        conn.close()

        if not notifications:
            return jsonify({'message': 'No notifications found for this student'}), 404

        return jsonify({'student_id': student_id, 'notifications': notifications})

    except mysql.connector.Error as e:
        return jsonify({'error': f'Database error: {e}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def send_emails(recipients, subject, body):
    with app.app_context():
        # Send emails in batches to avoid rate limits
        batch_size = 50
        for i in range(0, len(recipients), batch_size):
            batch = recipients[i:i+batch_size]

            for recipient in batch:
                msg = Message(
                    subject=subject,
                    recipients=[recipient],
                    body=body,
                    sender=f"Ishanya <{app.config['MAIL_DEFAULT_SENDER']}>"
                )
                mail.send(msg)
def send_email(recipient, subject, body):
    with app.app_context():
        msg = Message(
            subject=subject,
            recipients=[recipient],
            body=body,
            sender=f"Ishanya <{app.config['MAIL_DEFAULT_SENDER']}>"
        )
        mail.send(msg)
# Endpoint for sending email broadcasts
@app.route('/send-email-broadcast', methods=['POST'])
def send_email_broadcast():
    try:
        data = request.get_json()
        subject = data.get('subject')
        body = data.get('body')
        send_to_student_parents = data.get('sendToStudentParents', False)
        send_to_employees = data.get('sendToEmployees', False)

        if not subject or not body:
            return jsonify({'error': 'Subject and body are required'}), 400

        if not send_to_student_parents and not send_to_employees:
            return jsonify({'error': 'At least one recipient group must be selected'}), 400

        # Get email recipients
        recipients = []

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        if send_to_student_parents:
            cursor.execute("SELECT DISTINCT Parent_Email FROM Student WHERE Parent_Email IS NOT NULL AND Parent_Email != ''")
            parent_emails = cursor.fetchall()
            recipients.extend([email['Parent_Email'] for email in parent_emails])

        if send_to_employees:
            cursor.execute("SELECT DISTINCT Email FROM Employees WHERE Email IS NOT NULL AND Email != ''")
            employee_emails = cursor.fetchall()
            recipients.extend([email['Email'] for email in employee_emails])

        cursor.close()
        conn.close()

        # Remove duplicates
        recipients = list(set(recipients))

        if not recipients:
            return jsonify({'error': 'No valid recipients found'}), 400

        # Send emails
        send_emails(recipients, subject, body)

        return jsonify({
            'success': True,
            'message': f'Email broadcast sent to {len(recipients)} recipients'
        })

    except Exception as e:
        print("Error sending email broadcast:", e)
        return jsonify({'error': f'Failed to send email broadcast: {str(e)}'}), 500

@app.route('/notify-multiple', methods=['POST'])
def notify_multiple():
    try:
        data = request.get_json()
        student_ids = data.get('student_ids', [])
        title = data.get('title')
        body = data.get('body')

        if not student_ids or not title or not body:
            return jsonify({'error': 'Student IDs, title, and body are required'}), 400

        successful_notifications = []
        failed_notifications = []
        db_failed_notifications = []

        # Insert notifications into the database
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            # Bulk insert notifications
            notification_values = [(title, body, student_id) for student_id in student_ids]
            cursor.executemany(
                "INSERT INTO Notifications (Title, Body, Student_ID, Date_Time) VALUES (%s, %s, %s, NOW())",
                notification_values
            )

            conn.commit()
        except mysql.connector.Error as e:
            conn.rollback()
            cursor.close()
            conn.close()
            return jsonify({'error': f'Database error: {e}'}), 500

        # Fetch tokens from database
        cursor.execute(
            "SELECT Student_ID, Token FROM UserTokens WHERE Student_ID IN ({})".format(
                ','.join(['%s'] * len(student_ids))
            ),
            tuple(student_ids)
        )
        tokens = dict(cursor.fetchall())  # Convert result to dictionary {student_id: token}

        cursor.close()
        conn.close()

        # Send notifications via Firebase
        for student_id in student_ids:
            token = tokens.get(student_id)
            if not token:
                failed_notifications.append({'student_id': student_id, 'reason': 'No token found'})
                continue

            try:
                message = messaging.Message(
                    notification=messaging.Notification(title=title, body=body),
                    token=token,
                )
                response = messaging.send(message)
                successful_notifications.append({'student_id': student_id, 'message_id': response})
            except messaging.UnregisteredError:
                # Handle invalid/unregistered tokens
                failed_notifications.append({'student_id': student_id, 'reason': 'Token is no longer valid'})

                # Remove invalid token from the database
                try:
                    conn = get_db_connection()
                    cursor = conn.cursor()
                    cursor.execute("DELETE FROM UserTokens WHERE Student_ID = %s", (student_id,))
                    conn.commit()
                    cursor.close()
                    conn.close()
                except mysql.connector.Error as e:
                    print(f"Error removing invalid token for {student_id}: {e}")
            except messaging.FirebaseError as e:
                failed_notifications.append({'student_id': student_id, 'reason': f'Firebase error: {e.code}'})
            except Exception as e:
                failed_notifications.append({'student_id': student_id, 'reason': str(e)})

        return jsonify({
            'success': True,
            'successful_notifications': successful_notifications,
            'failed_notifications': failed_notifications,
            'db_failed_notifications': db_failed_notifications,
            'summary': {
                'total': len(student_ids),
                'successful': len(successful_notifications),
                'failed': len(failed_notifications),
                'db_failed': len(db_failed_notifications)
            }
        })

    except Exception as e:
        print("Error sending notifications:", e)
        return jsonify({'error': f'Failed to send notifications: {str(e)}'}), 500


@app.route('/contact-query', methods=['POST'])
def add_contact_query():
    try:
        data = request.get_json()
        parent_name = data.get('Parent_Name')
        parent_email = data.get('Parent_Email')
        student_name = data.get('Student_Name', '')  # Optional
        query = data.get('Query')

        if not parent_name or not parent_email or not query:
            return jsonify({'error': 'Parent name, email and query are required'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert into Contact_queries table
        cursor.execute(
            "INSERT INTO Contact_queries (Parent_Name, Parent_Email, Student_Name, Query) VALUES (%s, %s, %s, %s)",
            (parent_name, parent_email, student_name, query)
        )

        conn.commit()
        query_id = cursor.lastrowid

        cursor.close()
        conn.close()

        return jsonify({
            'success': True,
            'message': 'Query submitted successfully',
            'query_id': query_id
        }), 201

    except Exception as e:
        print("Error adding contact query:", e)
        return jsonify({'success': False, 'message': 'Failed to submit query'}), 500

@app.route('/contact-queries', methods=['GET'])
def get_contact_queries():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Get all queries
        cursor.execute("SELECT * FROM Contact_queries ORDER BY Query_ID DESC")
        queries = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(queries), 200

    except Exception as e:
        print("Error fetching contact queries:", e)
        return jsonify({'error': 'Failed to fetch contact queries: ' + str(e)}), 500

@app.route('/contact-query/<int:query_id>', methods=['DELETE'])
def resolve_contact_query(query_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if query exists
        cursor.execute("SELECT * FROM Contact_queries WHERE Query_ID = %s", (query_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'success': False, 'message': 'Query not found'}), 404

        # Delete the query
        cursor.execute("DELETE FROM Contact_queries WHERE Query_ID = %s", (query_id,))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            'success': True,
            'message': 'Query resolved successfully'
        }), 200

    except Exception as e:
        print("Error resolving contact query:", e)
        return jsonify({'success': False, 'message': 'Failed to resolve query'}), 500

@app.route('/get_educator_by_id', methods=['POST'])
def get_educator_by_id():
    data = request.get_json()
    employee_id = data.get('Employee_ID')

    if not employee_id:
        return jsonify({'error': 'Employee_ID is required'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = '''
            SELECT Educator_Name, Photo, Designation, Email, Phone
            FROM Educator
            WHERE Employee_ID = %s
        '''
        cursor.execute(query, (employee_id,))
        educator = cursor.fetchone()

        cursor.close()
        conn.close()
        if educator:
            # Handle the BLOB data - either convert to base64 or exclude it
            if 'Photo' in educator and educator ['Photo'] is not None:
                # Option 1: Remove the Photo field
                educator.pop('Photo', None)

                # Option 2 (alternative): Convert to base64
                # import base64
                # educator['Photo'] = base64.b64encode(educator['Photo']).decode('utf-8')

            return jsonify(educator)
        else:
            return jsonify({'error': 'Educator not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/dashboard-stats', methods=['GET'])
def get_dashboard_stats():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Get total students count
        cursor.execute("SELECT COUNT(*) as count FROM Student")
        total_students = cursor.fetchone()['count']

        # Get total employees count
        cursor.execute("SELECT COUNT(*) as count FROM Employees")
        total_employees = cursor.fetchone()['count']

        # Get total programs count
        cursor.execute("SELECT COUNT(*) as count FROM Programs")
        total_programs = cursor.fetchone()['count']

        # Get total reports count
        cursor.execute("SELECT COUNT(*) as count FROM Report")
        total_reports = cursor.fetchone()['count']

        cursor.close()
        conn.close()

        return jsonify({
            'totalStudents': total_students,
            'totalEmployees': total_employees,
            'totalPrograms': total_programs,
            'totalReports': total_reports
        }), 200

    except Exception as e:
        print("Error fetching dashboard stats:", e)
        return jsonify({'error': f'Failed to fetch dashboard stats: {str(e)}'}), 500

@app.route('/attendance', methods=['POST'])
def add_attendance():
    try:
        data = request.get_json()
        student_id = data.get('S_ID')
        date = data.get('Date')
        present = data.get('Present')

        if not student_id or not date:
            return jsonify({'error': 'Student ID and Date are required'}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Check if attendance record already exists for this student and date
        cursor.execute(
            "SELECT * FROM Attendance WHERE S_ID = %s AND Date = %s",
            (student_id, date)
        )
        existing_record = cursor.fetchone()

        if existing_record:
            # Update existing record
            cursor.execute(
                "UPDATE Attendance SET Present = %s WHERE S_ID = %s AND Date = %s",
                (present, student_id, date)
            )
            conn.commit()
            cursor.close()
            conn.close()
            
            return jsonify({
                'success': True,
                'message': 'Attendance updated successfully'
            }), 200
        else:
            # Insert new record
            cursor.execute(
                "INSERT INTO Attendance (S_ID, Date, Present) VALUES (%s, %s, %s)",
                (student_id, date, present)
            )
            conn.commit()
            attendance_id = cursor.lastrowid
            cursor.close()
            conn.close()
            
            return jsonify({
                'success': True,
                'message': 'Attendance recorded successfully',
                'attendance_id': attendance_id
            }), 201

    except Exception as e:
        print("Error adding/updating attendance:", e)
        return jsonify({'success': False, 'message': f'Failed to record/update attendance: {str(e)}'}), 500


@app.route('/attendance/<string:student_id>', methods=['GET'])
def get_attendance(student_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
        SELECT
            COUNT(*) AS total_days,
            SUM(CASE WHEN Present = 1 THEN 1 ELSE 0 END) AS present_days
        FROM Attendance
        WHERE S_ID = %s
        """
        cursor.execute(query, (student_id,))
        result = cursor.fetchone()

        if result:
            total_days, present_days = result
            return jsonify({
                'S_ID': student_id,
                'total_days': total_days,
                'present_days': present_days
            })
        else:
            return jsonify({'message': 'Student not found'}), 404

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/attendance/history/<string:student_id>', methods=['GET'])
def get_attendance_history(student_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT S_ID, Date, Present
        FROM Attendance
        WHERE S_ID = %s
        ORDER BY Date DESC
        """
        cursor.execute(query, (student_id,))
        attendance_records = cursor.fetchall()

        cursor.close()
        conn.close()

        if attendance_records:
            # Format dates to be more readable
            for record in attendance_records:
                record['Date'] = record['Date'].strftime('%Y-%m-%d')
                record['Status'] = 'Present' if record['Present'] else 'Absent'

            return jsonify({
                'S_ID': student_id,
                'attendance_records': attendance_records
            })
        else:
            return jsonify({
                'S_ID': student_id,
                'attendance_records': []
            })

    except Exception as e:
        print(f"Error fetching attendance history: {str(e)}")
        return jsonify({'error': f'Failed to fetch attendance history: {str(e)}'}), 500

@app.route('/get_student_programs', methods=['GET'])
def get_student_programs():
    student_id = request.args.get('student_id')
    if not student_id:
        return jsonify({'error': 'student_id parameter is required'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT ps.Program_ID, p.Program_Name
            FROM Program_Students ps
            JOIN Programs p ON ps.Program_ID = p.Program_ID
            WHERE ps.Student_ID = %s
        """
        cursor.execute(query, (student_id,))
        programs = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(programs)

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

@app.route('/api/student-performance/<student_id>/<quarter>', methods=['GET'])
def fetch_student_performance_by_quarter(student_id, quarter):
    return get_student_performance_by_quarter(student_id, quarter)

@app.route('/update-password', methods=['POST'])
def update_password():
    try:
        data = request.get_json()
        user_id = data.get('userId')
        current_password = data.get('currentPassword')
        new_password = data.get('newPassword')

        if not user_id or not current_password or not new_password:
            return jsonify({'error': 'Missing required fields'}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # First verify the current password
        query = "SELECT * FROM auth WHERE ID = %s AND pwd = %s"
        cursor.execute(query, (user_id, current_password))
        user = cursor.fetchone()

        if not user:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Current password is incorrect'}), 401

        # Update the password
        update_query = "UPDATE auth SET pwd = %s WHERE ID = %s"
        cursor.execute(update_query, (new_password, user_id))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            'message': 'Password updated successfully'
        }), 200

    except Exception as e:
        print("Error updating password:", e)
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/reports', methods=['POST'])
def get_reports():
    try:
        data = request.get_json()
        user_id = data.get('userId')
        user_type = data.get('userType')

        if not user_id or user_type is None:
            return jsonify({'error': 'userId and userType are required in request body'}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = ''
        params = []

        if user_type == 0:
            query = 'SELECT * FROM Report WHERE Student_ID = %s'
            params = [user_id]
        elif user_type == 1:
            query = '''
                SELECT r.*
                FROM Report r
                JOIN Student s ON r.Student_ID = s.S_ID
                WHERE s.Primary_E_ID = %s OR s.Secondary_E_ID = %s
            '''
            params = [user_id, user_id]
        elif user_type >= 2:
            query = 'SELECT * FROM Report'
        else:
            return jsonify({'error': 'Unauthorized access'}), 403

        cursor.execute(query, params)
        reports = cursor.fetchall()

        if user_type >= 3:
            cursor.execute('SELECT S_ID, Fname, Lname FROM Student')
            students = {s['S_ID']: f"{s['Fname']} {s['Lname']}" for s in cursor.fetchall()}
            for report in reports:
                report['StudentName'] = students.get(report['Student_ID'], 'Unknown')

        cursor.close()
        conn.close()

        return jsonify(reports)

    except Exception as e:
        error_details = {
            'error': 'Failed to fetch reports',
            'error_type': type(e).__name__,
            'error_message': str(e),
            'error_details': repr(e)
        }
        print("Error fetching reports:", error_details)
        return jsonify(error_details), 500


@app.route('/reports/add', methods=['POST'])
def add_report():
    try:
        data = request.get_json()
        student_id = data.get('studentId')
        quarter = data.get('quarter')
        report_url = data.get('reportUrl')

        if not student_id or not quarter or not report_url:
            return jsonify({'error': 'Missing required fields'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if student exists
        cursor.execute("SELECT * FROM Student WHERE S_ID = %s", (student_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'Student not found'}), 404

        # Insert or update report
        query = """
            INSERT INTO Report (Student_ID, Quarter, Report_URL)
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE Report_URL = %s
        """
        cursor.execute(query, (student_id, quarter, report_url, report_url))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'message': 'Report added successfully'}), 201

    except Exception as e:
        error_details = {
            'error': 'Failed to add report',
            'error_type': type(e).__name__,
            'error_message': str(e),
            'error_details': repr(e)
        }
        print("Error adding report:", error_details)
        return jsonify(error_details), 500
@app.route('/delete-employee/<employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # First check if employee exists
        cursor.execute("SELECT * FROM Employees WHERE Employee_ID = %s", (employee_id,))
        employee = cursor.fetchone()

        if not employee:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Employee not found'}), 404

        # Delete from auth table first (foreign key constraint)
        cursor.execute("DELETE FROM auth WHERE ID = %s", (employee_id,))

        # Delete from Program_Employees if exists
        cursor.execute("DELETE FROM Program_Employees WHERE Employee_ID = %s", (employee_id,))

        # Delete from Educator table if exists
        cursor.execute("DELETE FROM Educator WHERE Employee_ID = %s", (employee_id,))

        # Finally delete from Employees table
        cursor.execute("DELETE FROM Employees WHERE Employee_ID = %s", (employee_id,))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            'success': True,
            'message': f'Employee {employee_id} deleted successfully'
        }), 200

    except Exception as e:
        print("Error deleting employee:", e)
        return jsonify({'error': f'Failed to delete employee: {str(e)}'}), 500

@app.route('/get_student_performance', methods=['POST'])
def get_student_performance():
    try:
        data = request.get_json()
        student_id = data.get('studentId')
        table_name = data.get('tableName')

        # Validate inputs
        if not student_id or not table_name:
            return jsonify({'error': 'Student ID and table name are required'}), 400

        # Sanitize table name to prevent SQL injection
        valid_tables = ['Performance_1', 'Performance_2', 'Performance_3', 'Performance_4']
        if table_name not in valid_tables:
            return jsonify({'error': 'Invalid table name'}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Get performance data
        query = f"SELECT * FROM {table_name} WHERE Student_ID = %s"
        cursor.execute(query, (student_id,))
        performance = cursor.fetchone()

        cursor.close()
        conn.close()

        if performance:
            return jsonify(performance)
        else:
            # Return empty structure if no data exists yet
            return jsonify({
                'Student_ID': student_id,
                'Cognitive_score': 3,
                'Communication_score': 3,
                'Reasoning_score': 3,
                'Disability_type': '',
                'AdditionalMetrics': '{}'
            })

    except Exception as e:
        print(f"Error fetching student performance: {str(e)}")
        return jsonify({'error': f'Failed to fetch performance data: {str(e)}'}), 500

@app.route('/update_student_performance', methods=['POST'])
def update_student_performance():
    try:
        data = request.get_json()
        student_id = data.get('studentId')
        table_name = data.get('tableName')
        performance_data = data.get('performanceData')

        # Validate inputs
        if not student_id or not table_name or not performance_data:
            return jsonify({'error': 'Missing required data'}), 400

        # Sanitize table name to prevent SQL injection
        valid_tables = ['Performance_1', 'Performance_2', 'Performance_3', 'Performance_4']
        if table_name not in valid_tables:
            return jsonify({'error': 'Invalid table name'}), 400

        # Validate score values (must be between 1-5)
        cognitive_score = float(performance_data.get('Cognitive_score', 3))
        communication_score = float(performance_data.get('Communication_score', 3))
        reasoning_score = float(performance_data.get('Reasoning_score', 3))

        # Validate AdditionalMetrics JSON
        additional_metrics = performance_data.get('Additional_Metrics', '{}')
        try:
            metrics_obj = json.loads(additional_metrics)

            # Validate each metric value is between 1-5
            for metric_name, metric_data in metrics_obj.items():
                if not 1 <= float(metric_data.get('Value', 3)) <= 5:
                    return jsonify({'error': f'Value for metric {metric_name} must be between 1 and 5'}), 400

        except json.JSONDecodeError:
            return jsonify({'error': 'Invalid JSON format for Additional_Metrics'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if record exists
        cursor.execute(f"SELECT 1 FROM {table_name} WHERE Student_ID = %s", (student_id,))
        record_exists = cursor.fetchone() is not None

        if record_exists:
            # Update existing record
            query = f"""
                UPDATE {table_name}
                SET Cognitive_score = %s,
                    Communication_score = %s,
                    Reasoning_score = %s,
                    Additional_Metrics = %s
                WHERE Student_ID = %s
            """
            cursor.execute(
                query,
                (
                    cognitive_score,
                    communication_score,
                    reasoning_score,
                    additional_metrics,
                    student_id
                )
            )
        else:
            # Insert new record
            query = f"""
                INSERT INTO {table_name}
                (Student_ID, Cognitive_score, Communication_score, Reasoning_score, Additional_Metrics)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(
                query,
                (
                    student_id,
                    cognitive_score,
                    communication_score,
                    reasoning_score,
                    additional_metrics
                )
            )

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'success': True, 'message': 'Performance data updated successfully'})

    except Exception as e:
        print(f"Error updating student performance: {str(e)}")
        return jsonify({'error': f'Failed to update performance data: {str(e)}'}), 500
