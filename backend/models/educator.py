from models.db_connect import get_db_connection
from flask import jsonify
from mysql.connector import IntegrityError

def insert_educator(data):
    try:
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

        cursor.close()
        conn.close()
    
    except IntegrityError as e:
        error_message = str(e)
        if 'Duplicate entry' in error_message:
            if 'PRIMARY' in error_message:
                return jsonify({'success': False, 'message': 'An educator with this Employee ID already exists'}), 409
            else:
                return jsonify({'success': False, 'message': 'Database integrity error'}), 409
        return jsonify({'success': False, 'message': 'Database integrity error'}), 500
    
def get_educators_map():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT Employee_ID, Educator_Name FROM Educator"
    cursor.execute(query)
    educators = cursor.fetchall()

    cursor.close()
    conn.close()

    return educators