from models.db_connect import get_db_connection

def get_employee_by_id_model(employee_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM Employees WHERE Employee_ID = %s"
    cursor.execute(query, (employee_id,))
    employee = cursor.fetchone()

    cursor.close()
    conn.close()

    return employee

def get_all_employees():
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

    return employees

def update_employee(data, emp_id):
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