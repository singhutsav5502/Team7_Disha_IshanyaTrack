from models.db_connect import get_db_connection

# need to put login validations
def authenticate(user_id, password):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = f'SELECT * FROM auth WHERE ID = {user_id} AND pwd = {password}'
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    return user