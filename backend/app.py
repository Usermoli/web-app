from flask import Flask
from flask_cors import CORS
from routes.cases import cases_bp
from database.db import init_db, migrate_db

app = Flask(__name__)
CORS(app)

app.register_blueprint(cases_bp, url_prefix='/api')

@app.route('/')
def index():
    return 'Case Management API is running'

if __name__ == '__main__':
    init_db()
    migrate_db()
    app.run(debug=True, port=5000)
