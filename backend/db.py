from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db():
    from models import User, Todo
    db.drop_all()
    db.create_all()
