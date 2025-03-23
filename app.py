from flask import Flask, request, jsonify, render_template
import mysql.connector

from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'fallback-secret')

# Database Configuration
db_config = {
    'host': os.environ.get('DB_HOST'),
    'user': os.environ.get('DB_USER'),
    'password': os.environ.get('DB_PASSWORD'),
    'database': os.environ.get('DB_NAME')
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

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
            return jsonify(student)
        else:
            return jsonify({'error': 'Student not found'}), 404

    except mysql.connector.Error as err:
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

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

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
                Program_ID, Program2_ID, Sessions, Timings, Days_of_Week,
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
            'Program_ID', 'Program2_ID', 'Sessions', 'Timings', 'Days_of_Week',
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
