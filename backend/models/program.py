from models.db_connect import get_db_connection
import json

def get_all_programs():
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

    return programs

def insert_program(program_name):
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

    return program_id

def delete_program(program_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    # First, check if the program exists
    cursor.execute("SELECT * FROM Programs WHERE Program_ID = %s", (program_id,))
    program = cursor.fetchone()

    if not program:
        return -1

    # Perform delete
    cursor.execute("DELETE FROM Programs WHERE Program_ID = %s", (program_id,))
    conn.commit()

    cursor.close()
    conn.close()

def add_educator(program_id, educator_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT Employee_IDs FROM Programs WHERE Program_ID = %s", (program_id,))
    result = cursor.fetchone()

    if not result:
        return -1
    
    # Fetch current Employee_IDs
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

    return employee_ids

def add_student(program_id, student_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch current Student_IDs
    cursor.execute("SELECT Student_IDs FROM Programs WHERE Program_ID = %s", (program_id,))
    result = cursor.fetchone()

    if not result:
        return -1
        

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

    return student_ids