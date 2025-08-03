from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from db import db, init_db
from auth import auth_bp
from todos import todos_bp
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

# ✅ Enable CORS for frontend origin
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

db.init_app(app)
jwt = JWTManager(app)

with app.app_context():
    init_db()

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(todos_bp, url_prefix="/api/todos")

@app.route("/")
def home():
    return {"message": "To-Do App Backend Running"}

if __name__ == "__main__":
    app.run(debug=True)
