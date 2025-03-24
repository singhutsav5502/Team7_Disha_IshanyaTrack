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