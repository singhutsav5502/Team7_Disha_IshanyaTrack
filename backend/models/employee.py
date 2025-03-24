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

        return employees
    
    except Exception as e:
        print(e)

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

def insert_employee(employee_id, data):
    employee_data = {
        'Employee_ID': employee_id,
        **data
    }

    conn = get_db_connection()
    cursor = conn.cursor()

    # Insert into Employees table
    fields = ', '.join(employee_data.keys())
    placeholders = ', '.join(['%s'] * len(employee_data))
    values = tuple(employee_data.values())

    query = f"INSERT INTO Employees ({fields}) VALUES ({placeholders})"
    cursor.execute(query, values)

    # Add to auth table with standard password
    standard_password = 'welcome123'  # generate dynamically while setting up email
    cursor.execute(
        "INSERT INTO auth (ID, pwd, type) VALUES (%s, %s, %s)",
        (employee_id, standard_password, 1)  # Assuming 1 is the type for employees
    )

    # Add to Program_Employees table
    program_id = data.get('Program_ID')
    if program_id:
        cursor.execute(
            "INSERT INTO Program_Employees (Employee_ID, Program_ID) VALUES (%s, %s)",
            (employee_id, program_id)
        )

    conn.commit()
    cursor.close()
    conn.close()

def update_employee_role_model(employee_id, new_role_type):
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