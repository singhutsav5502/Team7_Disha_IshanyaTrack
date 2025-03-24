from models.db_connect import get_db_connection

def get_student_id(student_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM Student WHERE S_ID = %s"
    cursor.execute(query, (student_id,))
    student = cursor.fetchone()

    cursor.close()
    conn.close()

    return student

def get_all_students():
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

        return result

    except Exception as e:
        print(e)
        
def update_student(data, student_id):
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

def insert_student(student_id, student_data, data):
    conn = get_db_connection()
    cursor = conn.cursor()

    fields = ', '.join(student_data.keys())
    placeholders = ', '.join(['%s'] * len(student_data))
    values = tuple(student_data.values())

    query = f"INSERT INTO Student ({fields}) VALUES ({placeholders})"
    cursor.execute(query, values)

    # Add to auth table with standard password
    standard_password = 'welcome123'  # generate dynamically while setting up email
    cursor.execute(
        "INSERT INTO auth (ID, pwd, type) VALUES (%s, %s, %s)",
        (student_id, standard_password, 0)  # Assuming 0 is the type for students
    )

    # Add to Program_Students table
    program_id = data.get('Program_ID')
    if program_id:
        cursor.execute(
            "INSERT INTO Program_Students (Student_ID, Program_ID) VALUES (%s, %s)",
            (student_id, program_id)
        )

    conn.commit()
    cursor.close()
    conn.close()