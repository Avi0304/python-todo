from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Todo, User
from db import db
from utils import send_email
from datetime import datetime


todos_bp = Blueprint("todos", __name__)

@todos_bp.route("/", methods=["GET"])
@jwt_required()
def get_todos():
    user_id = get_jwt_identity()
    todos = Todo.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": t.id,
        "task": t.task,
        "done": t.done,
        "created_at": t.created_at.isoformat()
    } for t in todos])

@todos_bp.route("/", methods=["POST"])
@jwt_required()
def create_todo():
    user_id = get_jwt_identity()

    # Fetch user to ensure they exist
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "Invalid user ID"}), 400

    data = request.get_json()
    if not data or "task" not in data:
        return jsonify({"message": "Missing 'task' field"}), 400

    if not isinstance(data["task"], str):
        return jsonify({"message": "Task must be a string"}), 400

    # Create and save todo
    todo = Todo(
        task=data["task"],
        done=False,
        created_at=datetime.utcnow(),
        user_id=user_id
    )
    db.session.add(todo)
    db.session.commit()

    # Optional: send email
    send_email(user.email, "New Todo Created", f"Task: {todo.task}")

    return jsonify({"message": "Todo created"}), 201


@todos_bp.route("/<int:todo_id>", methods=["PUT"])
@jwt_required()
def update_todo(todo_id):
    user_id = get_jwt_identity()
    data = request.json
    todo = Todo.query.filter_by(id=todo_id, user_id=user_id).first()
    if not todo:
        return jsonify({"message": "Todo not found"}), 404

    todo.task = data.get("task", todo.task)
    todo.done = data.get("done", todo.done)
    db.session.commit()
    return jsonify({"message": "Todo updated"})

@todos_bp.route("/<int:todo_id>", methods=["DELETE"])
@jwt_required()
def delete_todo(todo_id):
    user_id = get_jwt_identity()
    todo = Todo.query.filter_by(id=todo_id, user_id=user_id).first()
    if not todo:
        return jsonify({"message": "Todo not found"}), 404
    db.session.delete(todo)
    db.session.commit()
    return jsonify({"message": "Todo deleted"})
