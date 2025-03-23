from flask import Flask, render_template
from flask_cors import CORS
import os
from dotenv import load_dotenv
load_dotenv()

from routes import auth, student, employee


app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'fallback-secret')
CORS(app, resources={r"/*": {"origins": "*"}})


app.register_blueprint(auth.auth_bp)
app.register_blueprint(student.student_bp)
app.register_blueprint(employee.employee_btp)


@app.route('/')
def home():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)
