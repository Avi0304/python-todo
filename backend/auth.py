from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models import User
from db import db
import os
from google.oauth2 import id_token
from google.auth.transport import requests

auth_bp = Blueprint("auth", __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "User already exists"}), 409
    hashed_pw = generate_password_hash(data['password'])
    user = User(email=data['email'], password=hashed_pw)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        token = create_access_token(identity=str(user.id))  # Convert user ID to string
        return jsonify({"token": token})
    return jsonify({"message": "Invalid credentials"}), 401

@auth_bp.route('/google-login', methods=['POST'])
def google_login():
    token = request.json.get("credential")
    if not token:
        return jsonify({"message": "No token provided"}), 400

    try:
        client_id = os.getenv("GOOGLE_CLIENT_ID")
        if not client_id:
            return jsonify({"message": "Google client ID not set in env"}), 500

        idinfo = id_token.verify_oauth2_token(token, requests.Request(), client_id)
        email = idinfo.get('email')
        sub = idinfo.get('sub')

        if not email:
            return jsonify({"message": "Email not found in token"}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(email=email, google_id=sub)
            db.session.add(user)
            db.session.commit()

        jwt_token = create_access_token(identity=str(user.id))
        return jsonify({"token": jwt_token})

    except ValueError as ve:
        # This usually indicates an invalid token
        return jsonify({"message": f"Token validation error: {str(ve)}"}), 400
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": f"Google login failed: {str(e)}"}), 400

    token = request.json.get("credential")
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), os.getenv("GOOGLE_CLIENT_ID"))
        email = idinfo['email']
        sub = idinfo['sub']

        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(email=email, google_id=sub)
            db.session.add(user)
            db.session.commit()

        jwt_token = create_access_token(identity=str(user.id))  # Convert user ID to string
        return jsonify({"token": jwt_token})

    except Exception as e:
        print(e)
        return jsonify({"message": "Google login failed"}), 400
